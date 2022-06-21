package com.kallpapay.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kallpapay.IntegrationTest;
import com.kallpapay.domain.MyCause;
import com.kallpapay.repository.MyCauseRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MyCauseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MyCauseResourceIT {

    private static final Long DEFAULT_PERCENTAGE = 1L;
    private static final Long UPDATED_PERCENTAGE = 2L;

    private static final String ENTITY_API_URL = "/api/my-causes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MyCauseRepository myCauseRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMyCauseMockMvc;

    private MyCause myCause;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MyCause createEntity(EntityManager em) {
        MyCause myCause = new MyCause().percentage(DEFAULT_PERCENTAGE);
        return myCause;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MyCause createUpdatedEntity(EntityManager em) {
        MyCause myCause = new MyCause().percentage(UPDATED_PERCENTAGE);
        return myCause;
    }

    @BeforeEach
    public void initTest() {
        myCause = createEntity(em);
    }

    @Test
    @Transactional
    void createMyCause() throws Exception {
        int databaseSizeBeforeCreate = myCauseRepository.findAll().size();
        // Create the MyCause
        restMyCauseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(myCause)))
            .andExpect(status().isCreated());

        // Validate the MyCause in the database
        List<MyCause> myCauseList = myCauseRepository.findAll();
        assertThat(myCauseList).hasSize(databaseSizeBeforeCreate + 1);
        MyCause testMyCause = myCauseList.get(myCauseList.size() - 1);
        assertThat(testMyCause.getPercentage()).isEqualTo(DEFAULT_PERCENTAGE);
    }

    @Test
    @Transactional
    void createMyCauseWithExistingId() throws Exception {
        // Create the MyCause with an existing ID
        myCause.setId(1L);

        int databaseSizeBeforeCreate = myCauseRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMyCauseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(myCause)))
            .andExpect(status().isBadRequest());

        // Validate the MyCause in the database
        List<MyCause> myCauseList = myCauseRepository.findAll();
        assertThat(myCauseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMyCauses() throws Exception {
        // Initialize the database
        myCauseRepository.saveAndFlush(myCause);

        // Get all the myCauseList
        restMyCauseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myCause.getId().intValue())))
            .andExpect(jsonPath("$.[*].percentage").value(hasItem(DEFAULT_PERCENTAGE.intValue())));
    }

    @Test
    @Transactional
    void getMyCause() throws Exception {
        // Initialize the database
        myCauseRepository.saveAndFlush(myCause);

        // Get the myCause
        restMyCauseMockMvc
            .perform(get(ENTITY_API_URL_ID, myCause.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(myCause.getId().intValue()))
            .andExpect(jsonPath("$.percentage").value(DEFAULT_PERCENTAGE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingMyCause() throws Exception {
        // Get the myCause
        restMyCauseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMyCause() throws Exception {
        // Initialize the database
        myCauseRepository.saveAndFlush(myCause);

        int databaseSizeBeforeUpdate = myCauseRepository.findAll().size();

        // Update the myCause
        MyCause updatedMyCause = myCauseRepository.findById(myCause.getId()).get();
        // Disconnect from session so that the updates on updatedMyCause are not directly saved in db
        em.detach(updatedMyCause);
        updatedMyCause.percentage(UPDATED_PERCENTAGE);

        restMyCauseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMyCause.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMyCause))
            )
            .andExpect(status().isOk());

        // Validate the MyCause in the database
        List<MyCause> myCauseList = myCauseRepository.findAll();
        assertThat(myCauseList).hasSize(databaseSizeBeforeUpdate);
        MyCause testMyCause = myCauseList.get(myCauseList.size() - 1);
        assertThat(testMyCause.getPercentage()).isEqualTo(UPDATED_PERCENTAGE);
    }

    @Test
    @Transactional
    void putNonExistingMyCause() throws Exception {
        int databaseSizeBeforeUpdate = myCauseRepository.findAll().size();
        myCause.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMyCauseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, myCause.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(myCause))
            )
            .andExpect(status().isBadRequest());

        // Validate the MyCause in the database
        List<MyCause> myCauseList = myCauseRepository.findAll();
        assertThat(myCauseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMyCause() throws Exception {
        int databaseSizeBeforeUpdate = myCauseRepository.findAll().size();
        myCause.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMyCauseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(myCause))
            )
            .andExpect(status().isBadRequest());

        // Validate the MyCause in the database
        List<MyCause> myCauseList = myCauseRepository.findAll();
        assertThat(myCauseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMyCause() throws Exception {
        int databaseSizeBeforeUpdate = myCauseRepository.findAll().size();
        myCause.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMyCauseMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(myCause)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MyCause in the database
        List<MyCause> myCauseList = myCauseRepository.findAll();
        assertThat(myCauseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMyCauseWithPatch() throws Exception {
        // Initialize the database
        myCauseRepository.saveAndFlush(myCause);

        int databaseSizeBeforeUpdate = myCauseRepository.findAll().size();

        // Update the myCause using partial update
        MyCause partialUpdatedMyCause = new MyCause();
        partialUpdatedMyCause.setId(myCause.getId());

        partialUpdatedMyCause.percentage(UPDATED_PERCENTAGE);

        restMyCauseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMyCause.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMyCause))
            )
            .andExpect(status().isOk());

        // Validate the MyCause in the database
        List<MyCause> myCauseList = myCauseRepository.findAll();
        assertThat(myCauseList).hasSize(databaseSizeBeforeUpdate);
        MyCause testMyCause = myCauseList.get(myCauseList.size() - 1);
        assertThat(testMyCause.getPercentage()).isEqualTo(UPDATED_PERCENTAGE);
    }

    @Test
    @Transactional
    void fullUpdateMyCauseWithPatch() throws Exception {
        // Initialize the database
        myCauseRepository.saveAndFlush(myCause);

        int databaseSizeBeforeUpdate = myCauseRepository.findAll().size();

        // Update the myCause using partial update
        MyCause partialUpdatedMyCause = new MyCause();
        partialUpdatedMyCause.setId(myCause.getId());

        partialUpdatedMyCause.percentage(UPDATED_PERCENTAGE);

        restMyCauseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMyCause.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMyCause))
            )
            .andExpect(status().isOk());

        // Validate the MyCause in the database
        List<MyCause> myCauseList = myCauseRepository.findAll();
        assertThat(myCauseList).hasSize(databaseSizeBeforeUpdate);
        MyCause testMyCause = myCauseList.get(myCauseList.size() - 1);
        assertThat(testMyCause.getPercentage()).isEqualTo(UPDATED_PERCENTAGE);
    }

    @Test
    @Transactional
    void patchNonExistingMyCause() throws Exception {
        int databaseSizeBeforeUpdate = myCauseRepository.findAll().size();
        myCause.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMyCauseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, myCause.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(myCause))
            )
            .andExpect(status().isBadRequest());

        // Validate the MyCause in the database
        List<MyCause> myCauseList = myCauseRepository.findAll();
        assertThat(myCauseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMyCause() throws Exception {
        int databaseSizeBeforeUpdate = myCauseRepository.findAll().size();
        myCause.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMyCauseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(myCause))
            )
            .andExpect(status().isBadRequest());

        // Validate the MyCause in the database
        List<MyCause> myCauseList = myCauseRepository.findAll();
        assertThat(myCauseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMyCause() throws Exception {
        int databaseSizeBeforeUpdate = myCauseRepository.findAll().size();
        myCause.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMyCauseMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(myCause)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MyCause in the database
        List<MyCause> myCauseList = myCauseRepository.findAll();
        assertThat(myCauseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMyCause() throws Exception {
        // Initialize the database
        myCauseRepository.saveAndFlush(myCause);

        int databaseSizeBeforeDelete = myCauseRepository.findAll().size();

        // Delete the myCause
        restMyCauseMockMvc
            .perform(delete(ENTITY_API_URL_ID, myCause.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MyCause> myCauseList = myCauseRepository.findAll();
        assertThat(myCauseList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
