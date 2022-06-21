package com.kallpapay.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kallpapay.IntegrationTest;
import com.kallpapay.domain.Cause;
import com.kallpapay.repository.CauseRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link CauseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CauseResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LOGO_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/causes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CauseRepository causeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCauseMockMvc;

    private Cause cause;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cause createEntity(EntityManager em) {
        Cause cause = new Cause()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .logo(DEFAULT_LOGO)
            .logoContentType(DEFAULT_LOGO_CONTENT_TYPE);
        return cause;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cause createUpdatedEntity(EntityManager em) {
        Cause cause = new Cause()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE);
        return cause;
    }

    @BeforeEach
    public void initTest() {
        cause = createEntity(em);
    }

    @Test
    @Transactional
    void createCause() throws Exception {
        int databaseSizeBeforeCreate = causeRepository.findAll().size();
        // Create the Cause
        restCauseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cause)))
            .andExpect(status().isCreated());

        // Validate the Cause in the database
        List<Cause> causeList = causeRepository.findAll();
        assertThat(causeList).hasSize(databaseSizeBeforeCreate + 1);
        Cause testCause = causeList.get(causeList.size() - 1);
        assertThat(testCause.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCause.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCause.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testCause.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createCauseWithExistingId() throws Exception {
        // Create the Cause with an existing ID
        cause.setId(1L);

        int databaseSizeBeforeCreate = causeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCauseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cause)))
            .andExpect(status().isBadRequest());

        // Validate the Cause in the database
        List<Cause> causeList = causeRepository.findAll();
        assertThat(causeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCauses() throws Exception {
        // Initialize the database
        causeRepository.saveAndFlush(cause);

        // Get all the causeList
        restCauseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cause.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))));
    }

    @Test
    @Transactional
    void getCause() throws Exception {
        // Initialize the database
        causeRepository.saveAndFlush(cause);

        // Get the cause
        restCauseMockMvc
            .perform(get(ENTITY_API_URL_ID, cause.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(cause.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.logoContentType").value(DEFAULT_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.logo").value(Base64Utils.encodeToString(DEFAULT_LOGO)));
    }

    @Test
    @Transactional
    void getNonExistingCause() throws Exception {
        // Get the cause
        restCauseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCause() throws Exception {
        // Initialize the database
        causeRepository.saveAndFlush(cause);

        int databaseSizeBeforeUpdate = causeRepository.findAll().size();

        // Update the cause
        Cause updatedCause = causeRepository.findById(cause.getId()).get();
        // Disconnect from session so that the updates on updatedCause are not directly saved in db
        em.detach(updatedCause);
        updatedCause.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).logo(UPDATED_LOGO).logoContentType(UPDATED_LOGO_CONTENT_TYPE);

        restCauseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCause.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCause))
            )
            .andExpect(status().isOk());

        // Validate the Cause in the database
        List<Cause> causeList = causeRepository.findAll();
        assertThat(causeList).hasSize(databaseSizeBeforeUpdate);
        Cause testCause = causeList.get(causeList.size() - 1);
        assertThat(testCause.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCause.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCause.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testCause.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingCause() throws Exception {
        int databaseSizeBeforeUpdate = causeRepository.findAll().size();
        cause.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCauseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, cause.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(cause))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cause in the database
        List<Cause> causeList = causeRepository.findAll();
        assertThat(causeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCause() throws Exception {
        int databaseSizeBeforeUpdate = causeRepository.findAll().size();
        cause.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCauseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(cause))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cause in the database
        List<Cause> causeList = causeRepository.findAll();
        assertThat(causeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCause() throws Exception {
        int databaseSizeBeforeUpdate = causeRepository.findAll().size();
        cause.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCauseMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cause)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cause in the database
        List<Cause> causeList = causeRepository.findAll();
        assertThat(causeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCauseWithPatch() throws Exception {
        // Initialize the database
        causeRepository.saveAndFlush(cause);

        int databaseSizeBeforeUpdate = causeRepository.findAll().size();

        // Update the cause using partial update
        Cause partialUpdatedCause = new Cause();
        partialUpdatedCause.setId(cause.getId());

        partialUpdatedCause.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restCauseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCause.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCause))
            )
            .andExpect(status().isOk());

        // Validate the Cause in the database
        List<Cause> causeList = causeRepository.findAll();
        assertThat(causeList).hasSize(databaseSizeBeforeUpdate);
        Cause testCause = causeList.get(causeList.size() - 1);
        assertThat(testCause.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCause.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCause.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testCause.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateCauseWithPatch() throws Exception {
        // Initialize the database
        causeRepository.saveAndFlush(cause);

        int databaseSizeBeforeUpdate = causeRepository.findAll().size();

        // Update the cause using partial update
        Cause partialUpdatedCause = new Cause();
        partialUpdatedCause.setId(cause.getId());

        partialUpdatedCause
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE);

        restCauseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCause.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCause))
            )
            .andExpect(status().isOk());

        // Validate the Cause in the database
        List<Cause> causeList = causeRepository.findAll();
        assertThat(causeList).hasSize(databaseSizeBeforeUpdate);
        Cause testCause = causeList.get(causeList.size() - 1);
        assertThat(testCause.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCause.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCause.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testCause.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingCause() throws Exception {
        int databaseSizeBeforeUpdate = causeRepository.findAll().size();
        cause.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCauseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, cause.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cause))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cause in the database
        List<Cause> causeList = causeRepository.findAll();
        assertThat(causeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCause() throws Exception {
        int databaseSizeBeforeUpdate = causeRepository.findAll().size();
        cause.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCauseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cause))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cause in the database
        List<Cause> causeList = causeRepository.findAll();
        assertThat(causeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCause() throws Exception {
        int databaseSizeBeforeUpdate = causeRepository.findAll().size();
        cause.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCauseMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(cause)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cause in the database
        List<Cause> causeList = causeRepository.findAll();
        assertThat(causeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCause() throws Exception {
        // Initialize the database
        causeRepository.saveAndFlush(cause);

        int databaseSizeBeforeDelete = causeRepository.findAll().size();

        // Delete the cause
        restCauseMockMvc
            .perform(delete(ENTITY_API_URL_ID, cause.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Cause> causeList = causeRepository.findAll();
        assertThat(causeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
