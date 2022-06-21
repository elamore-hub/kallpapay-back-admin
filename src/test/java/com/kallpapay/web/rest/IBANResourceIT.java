package com.kallpapay.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kallpapay.IntegrationTest;
import com.kallpapay.domain.IBAN;
import com.kallpapay.repository.IBANRepository;
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
 * Integration tests for the {@link IBANResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class IBANResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_IBAN = "AAAAAAAAAA";
    private static final String UPDATED_IBAN = "BBBBBBBBBB";

    private static final String DEFAULT_BIC = "AAAAAAAAAA";
    private static final String UPDATED_BIC = "BBBBBBBBBB";

    private static final String DEFAULT_ACCOUNT_OWNER = "AAAAAAAAAA";
    private static final String UPDATED_ACCOUNT_OWNER = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ibans";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private IBANRepository iBANRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIBANMockMvc;

    private IBAN iBAN;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static IBAN createEntity(EntityManager em) {
        IBAN iBAN = new IBAN().name(DEFAULT_NAME).iban(DEFAULT_IBAN).bic(DEFAULT_BIC).accountOwner(DEFAULT_ACCOUNT_OWNER);
        return iBAN;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static IBAN createUpdatedEntity(EntityManager em) {
        IBAN iBAN = new IBAN().name(UPDATED_NAME).iban(UPDATED_IBAN).bic(UPDATED_BIC).accountOwner(UPDATED_ACCOUNT_OWNER);
        return iBAN;
    }

    @BeforeEach
    public void initTest() {
        iBAN = createEntity(em);
    }

    @Test
    @Transactional
    void createIBAN() throws Exception {
        int databaseSizeBeforeCreate = iBANRepository.findAll().size();
        // Create the IBAN
        restIBANMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(iBAN)))
            .andExpect(status().isCreated());

        // Validate the IBAN in the database
        List<IBAN> iBANList = iBANRepository.findAll();
        assertThat(iBANList).hasSize(databaseSizeBeforeCreate + 1);
        IBAN testIBAN = iBANList.get(iBANList.size() - 1);
        assertThat(testIBAN.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testIBAN.getIban()).isEqualTo(DEFAULT_IBAN);
        assertThat(testIBAN.getBic()).isEqualTo(DEFAULT_BIC);
        assertThat(testIBAN.getAccountOwner()).isEqualTo(DEFAULT_ACCOUNT_OWNER);
    }

    @Test
    @Transactional
    void createIBANWithExistingId() throws Exception {
        // Create the IBAN with an existing ID
        iBAN.setId(1L);

        int databaseSizeBeforeCreate = iBANRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIBANMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(iBAN)))
            .andExpect(status().isBadRequest());

        // Validate the IBAN in the database
        List<IBAN> iBANList = iBANRepository.findAll();
        assertThat(iBANList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllIBANS() throws Exception {
        // Initialize the database
        iBANRepository.saveAndFlush(iBAN);

        // Get all the iBANList
        restIBANMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(iBAN.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].iban").value(hasItem(DEFAULT_IBAN)))
            .andExpect(jsonPath("$.[*].bic").value(hasItem(DEFAULT_BIC)))
            .andExpect(jsonPath("$.[*].accountOwner").value(hasItem(DEFAULT_ACCOUNT_OWNER)));
    }

    @Test
    @Transactional
    void getIBAN() throws Exception {
        // Initialize the database
        iBANRepository.saveAndFlush(iBAN);

        // Get the iBAN
        restIBANMockMvc
            .perform(get(ENTITY_API_URL_ID, iBAN.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(iBAN.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.iban").value(DEFAULT_IBAN))
            .andExpect(jsonPath("$.bic").value(DEFAULT_BIC))
            .andExpect(jsonPath("$.accountOwner").value(DEFAULT_ACCOUNT_OWNER));
    }

    @Test
    @Transactional
    void getNonExistingIBAN() throws Exception {
        // Get the iBAN
        restIBANMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewIBAN() throws Exception {
        // Initialize the database
        iBANRepository.saveAndFlush(iBAN);

        int databaseSizeBeforeUpdate = iBANRepository.findAll().size();

        // Update the iBAN
        IBAN updatedIBAN = iBANRepository.findById(iBAN.getId()).get();
        // Disconnect from session so that the updates on updatedIBAN are not directly saved in db
        em.detach(updatedIBAN);
        updatedIBAN.name(UPDATED_NAME).iban(UPDATED_IBAN).bic(UPDATED_BIC).accountOwner(UPDATED_ACCOUNT_OWNER);

        restIBANMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIBAN.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedIBAN))
            )
            .andExpect(status().isOk());

        // Validate the IBAN in the database
        List<IBAN> iBANList = iBANRepository.findAll();
        assertThat(iBANList).hasSize(databaseSizeBeforeUpdate);
        IBAN testIBAN = iBANList.get(iBANList.size() - 1);
        assertThat(testIBAN.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testIBAN.getIban()).isEqualTo(UPDATED_IBAN);
        assertThat(testIBAN.getBic()).isEqualTo(UPDATED_BIC);
        assertThat(testIBAN.getAccountOwner()).isEqualTo(UPDATED_ACCOUNT_OWNER);
    }

    @Test
    @Transactional
    void putNonExistingIBAN() throws Exception {
        int databaseSizeBeforeUpdate = iBANRepository.findAll().size();
        iBAN.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIBANMockMvc
            .perform(
                put(ENTITY_API_URL_ID, iBAN.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(iBAN))
            )
            .andExpect(status().isBadRequest());

        // Validate the IBAN in the database
        List<IBAN> iBANList = iBANRepository.findAll();
        assertThat(iBANList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIBAN() throws Exception {
        int databaseSizeBeforeUpdate = iBANRepository.findAll().size();
        iBAN.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIBANMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(iBAN))
            )
            .andExpect(status().isBadRequest());

        // Validate the IBAN in the database
        List<IBAN> iBANList = iBANRepository.findAll();
        assertThat(iBANList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIBAN() throws Exception {
        int databaseSizeBeforeUpdate = iBANRepository.findAll().size();
        iBAN.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIBANMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(iBAN)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the IBAN in the database
        List<IBAN> iBANList = iBANRepository.findAll();
        assertThat(iBANList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIBANWithPatch() throws Exception {
        // Initialize the database
        iBANRepository.saveAndFlush(iBAN);

        int databaseSizeBeforeUpdate = iBANRepository.findAll().size();

        // Update the iBAN using partial update
        IBAN partialUpdatedIBAN = new IBAN();
        partialUpdatedIBAN.setId(iBAN.getId());

        partialUpdatedIBAN.name(UPDATED_NAME);

        restIBANMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIBAN.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIBAN))
            )
            .andExpect(status().isOk());

        // Validate the IBAN in the database
        List<IBAN> iBANList = iBANRepository.findAll();
        assertThat(iBANList).hasSize(databaseSizeBeforeUpdate);
        IBAN testIBAN = iBANList.get(iBANList.size() - 1);
        assertThat(testIBAN.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testIBAN.getIban()).isEqualTo(DEFAULT_IBAN);
        assertThat(testIBAN.getBic()).isEqualTo(DEFAULT_BIC);
        assertThat(testIBAN.getAccountOwner()).isEqualTo(DEFAULT_ACCOUNT_OWNER);
    }

    @Test
    @Transactional
    void fullUpdateIBANWithPatch() throws Exception {
        // Initialize the database
        iBANRepository.saveAndFlush(iBAN);

        int databaseSizeBeforeUpdate = iBANRepository.findAll().size();

        // Update the iBAN using partial update
        IBAN partialUpdatedIBAN = new IBAN();
        partialUpdatedIBAN.setId(iBAN.getId());

        partialUpdatedIBAN.name(UPDATED_NAME).iban(UPDATED_IBAN).bic(UPDATED_BIC).accountOwner(UPDATED_ACCOUNT_OWNER);

        restIBANMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIBAN.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIBAN))
            )
            .andExpect(status().isOk());

        // Validate the IBAN in the database
        List<IBAN> iBANList = iBANRepository.findAll();
        assertThat(iBANList).hasSize(databaseSizeBeforeUpdate);
        IBAN testIBAN = iBANList.get(iBANList.size() - 1);
        assertThat(testIBAN.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testIBAN.getIban()).isEqualTo(UPDATED_IBAN);
        assertThat(testIBAN.getBic()).isEqualTo(UPDATED_BIC);
        assertThat(testIBAN.getAccountOwner()).isEqualTo(UPDATED_ACCOUNT_OWNER);
    }

    @Test
    @Transactional
    void patchNonExistingIBAN() throws Exception {
        int databaseSizeBeforeUpdate = iBANRepository.findAll().size();
        iBAN.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIBANMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, iBAN.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(iBAN))
            )
            .andExpect(status().isBadRequest());

        // Validate the IBAN in the database
        List<IBAN> iBANList = iBANRepository.findAll();
        assertThat(iBANList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIBAN() throws Exception {
        int databaseSizeBeforeUpdate = iBANRepository.findAll().size();
        iBAN.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIBANMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(iBAN))
            )
            .andExpect(status().isBadRequest());

        // Validate the IBAN in the database
        List<IBAN> iBANList = iBANRepository.findAll();
        assertThat(iBANList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIBAN() throws Exception {
        int databaseSizeBeforeUpdate = iBANRepository.findAll().size();
        iBAN.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIBANMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(iBAN)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the IBAN in the database
        List<IBAN> iBANList = iBANRepository.findAll();
        assertThat(iBANList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIBAN() throws Exception {
        // Initialize the database
        iBANRepository.saveAndFlush(iBAN);

        int databaseSizeBeforeDelete = iBANRepository.findAll().size();

        // Delete the iBAN
        restIBANMockMvc
            .perform(delete(ENTITY_API_URL_ID, iBAN.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<IBAN> iBANList = iBANRepository.findAll();
        assertThat(iBANList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
