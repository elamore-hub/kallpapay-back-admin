package com.kallpapay.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kallpapay.IntegrationTest;
import com.kallpapay.domain.SEPABeneficiary;
import com.kallpapay.repository.SEPABeneficiaryRepository;
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
 * Integration tests for the {@link SEPABeneficiaryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SEPABeneficiaryResourceIT {

    private static final String DEFAULT_EXTERNAL_ID = "AAAAAAAAAA";
    private static final String UPDATED_EXTERNAL_ID = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_MY_OWN_IBAN = false;
    private static final Boolean UPDATED_IS_MY_OWN_IBAN = true;

    private static final String DEFAULT_MASKED_IBAN = "AAAAAAAAAA";
    private static final String UPDATED_MASKED_IBAN = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sepa-beneficiaries";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SEPABeneficiaryRepository sEPABeneficiaryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSEPABeneficiaryMockMvc;

    private SEPABeneficiary sEPABeneficiary;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SEPABeneficiary createEntity(EntityManager em) {
        SEPABeneficiary sEPABeneficiary = new SEPABeneficiary()
            .externalId(DEFAULT_EXTERNAL_ID)
            .name(DEFAULT_NAME)
            .isMyOwnIban(DEFAULT_IS_MY_OWN_IBAN)
            .maskedIBAN(DEFAULT_MASKED_IBAN);
        return sEPABeneficiary;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SEPABeneficiary createUpdatedEntity(EntityManager em) {
        SEPABeneficiary sEPABeneficiary = new SEPABeneficiary()
            .externalId(UPDATED_EXTERNAL_ID)
            .name(UPDATED_NAME)
            .isMyOwnIban(UPDATED_IS_MY_OWN_IBAN)
            .maskedIBAN(UPDATED_MASKED_IBAN);
        return sEPABeneficiary;
    }

    @BeforeEach
    public void initTest() {
        sEPABeneficiary = createEntity(em);
    }

    @Test
    @Transactional
    void createSEPABeneficiary() throws Exception {
        int databaseSizeBeforeCreate = sEPABeneficiaryRepository.findAll().size();
        // Create the SEPABeneficiary
        restSEPABeneficiaryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sEPABeneficiary))
            )
            .andExpect(status().isCreated());

        // Validate the SEPABeneficiary in the database
        List<SEPABeneficiary> sEPABeneficiaryList = sEPABeneficiaryRepository.findAll();
        assertThat(sEPABeneficiaryList).hasSize(databaseSizeBeforeCreate + 1);
        SEPABeneficiary testSEPABeneficiary = sEPABeneficiaryList.get(sEPABeneficiaryList.size() - 1);
        assertThat(testSEPABeneficiary.getExternalId()).isEqualTo(DEFAULT_EXTERNAL_ID);
        assertThat(testSEPABeneficiary.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSEPABeneficiary.getIsMyOwnIban()).isEqualTo(DEFAULT_IS_MY_OWN_IBAN);
        assertThat(testSEPABeneficiary.getMaskedIBAN()).isEqualTo(DEFAULT_MASKED_IBAN);
    }

    @Test
    @Transactional
    void createSEPABeneficiaryWithExistingId() throws Exception {
        // Create the SEPABeneficiary with an existing ID
        sEPABeneficiary.setId(1L);

        int databaseSizeBeforeCreate = sEPABeneficiaryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSEPABeneficiaryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sEPABeneficiary))
            )
            .andExpect(status().isBadRequest());

        // Validate the SEPABeneficiary in the database
        List<SEPABeneficiary> sEPABeneficiaryList = sEPABeneficiaryRepository.findAll();
        assertThat(sEPABeneficiaryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSEPABeneficiaries() throws Exception {
        // Initialize the database
        sEPABeneficiaryRepository.saveAndFlush(sEPABeneficiary);

        // Get all the sEPABeneficiaryList
        restSEPABeneficiaryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sEPABeneficiary.getId().intValue())))
            .andExpect(jsonPath("$.[*].externalId").value(hasItem(DEFAULT_EXTERNAL_ID)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].isMyOwnIban").value(hasItem(DEFAULT_IS_MY_OWN_IBAN.booleanValue())))
            .andExpect(jsonPath("$.[*].maskedIBAN").value(hasItem(DEFAULT_MASKED_IBAN)));
    }

    @Test
    @Transactional
    void getSEPABeneficiary() throws Exception {
        // Initialize the database
        sEPABeneficiaryRepository.saveAndFlush(sEPABeneficiary);

        // Get the sEPABeneficiary
        restSEPABeneficiaryMockMvc
            .perform(get(ENTITY_API_URL_ID, sEPABeneficiary.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sEPABeneficiary.getId().intValue()))
            .andExpect(jsonPath("$.externalId").value(DEFAULT_EXTERNAL_ID))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.isMyOwnIban").value(DEFAULT_IS_MY_OWN_IBAN.booleanValue()))
            .andExpect(jsonPath("$.maskedIBAN").value(DEFAULT_MASKED_IBAN));
    }

    @Test
    @Transactional
    void getNonExistingSEPABeneficiary() throws Exception {
        // Get the sEPABeneficiary
        restSEPABeneficiaryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSEPABeneficiary() throws Exception {
        // Initialize the database
        sEPABeneficiaryRepository.saveAndFlush(sEPABeneficiary);

        int databaseSizeBeforeUpdate = sEPABeneficiaryRepository.findAll().size();

        // Update the sEPABeneficiary
        SEPABeneficiary updatedSEPABeneficiary = sEPABeneficiaryRepository.findById(sEPABeneficiary.getId()).get();
        // Disconnect from session so that the updates on updatedSEPABeneficiary are not directly saved in db
        em.detach(updatedSEPABeneficiary);
        updatedSEPABeneficiary
            .externalId(UPDATED_EXTERNAL_ID)
            .name(UPDATED_NAME)
            .isMyOwnIban(UPDATED_IS_MY_OWN_IBAN)
            .maskedIBAN(UPDATED_MASKED_IBAN);

        restSEPABeneficiaryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSEPABeneficiary.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSEPABeneficiary))
            )
            .andExpect(status().isOk());

        // Validate the SEPABeneficiary in the database
        List<SEPABeneficiary> sEPABeneficiaryList = sEPABeneficiaryRepository.findAll();
        assertThat(sEPABeneficiaryList).hasSize(databaseSizeBeforeUpdate);
        SEPABeneficiary testSEPABeneficiary = sEPABeneficiaryList.get(sEPABeneficiaryList.size() - 1);
        assertThat(testSEPABeneficiary.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testSEPABeneficiary.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSEPABeneficiary.getIsMyOwnIban()).isEqualTo(UPDATED_IS_MY_OWN_IBAN);
        assertThat(testSEPABeneficiary.getMaskedIBAN()).isEqualTo(UPDATED_MASKED_IBAN);
    }

    @Test
    @Transactional
    void putNonExistingSEPABeneficiary() throws Exception {
        int databaseSizeBeforeUpdate = sEPABeneficiaryRepository.findAll().size();
        sEPABeneficiary.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSEPABeneficiaryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sEPABeneficiary.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sEPABeneficiary))
            )
            .andExpect(status().isBadRequest());

        // Validate the SEPABeneficiary in the database
        List<SEPABeneficiary> sEPABeneficiaryList = sEPABeneficiaryRepository.findAll();
        assertThat(sEPABeneficiaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSEPABeneficiary() throws Exception {
        int databaseSizeBeforeUpdate = sEPABeneficiaryRepository.findAll().size();
        sEPABeneficiary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSEPABeneficiaryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sEPABeneficiary))
            )
            .andExpect(status().isBadRequest());

        // Validate the SEPABeneficiary in the database
        List<SEPABeneficiary> sEPABeneficiaryList = sEPABeneficiaryRepository.findAll();
        assertThat(sEPABeneficiaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSEPABeneficiary() throws Exception {
        int databaseSizeBeforeUpdate = sEPABeneficiaryRepository.findAll().size();
        sEPABeneficiary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSEPABeneficiaryMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sEPABeneficiary))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SEPABeneficiary in the database
        List<SEPABeneficiary> sEPABeneficiaryList = sEPABeneficiaryRepository.findAll();
        assertThat(sEPABeneficiaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSEPABeneficiaryWithPatch() throws Exception {
        // Initialize the database
        sEPABeneficiaryRepository.saveAndFlush(sEPABeneficiary);

        int databaseSizeBeforeUpdate = sEPABeneficiaryRepository.findAll().size();

        // Update the sEPABeneficiary using partial update
        SEPABeneficiary partialUpdatedSEPABeneficiary = new SEPABeneficiary();
        partialUpdatedSEPABeneficiary.setId(sEPABeneficiary.getId());

        partialUpdatedSEPABeneficiary.externalId(UPDATED_EXTERNAL_ID).name(UPDATED_NAME);

        restSEPABeneficiaryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSEPABeneficiary.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSEPABeneficiary))
            )
            .andExpect(status().isOk());

        // Validate the SEPABeneficiary in the database
        List<SEPABeneficiary> sEPABeneficiaryList = sEPABeneficiaryRepository.findAll();
        assertThat(sEPABeneficiaryList).hasSize(databaseSizeBeforeUpdate);
        SEPABeneficiary testSEPABeneficiary = sEPABeneficiaryList.get(sEPABeneficiaryList.size() - 1);
        assertThat(testSEPABeneficiary.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testSEPABeneficiary.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSEPABeneficiary.getIsMyOwnIban()).isEqualTo(DEFAULT_IS_MY_OWN_IBAN);
        assertThat(testSEPABeneficiary.getMaskedIBAN()).isEqualTo(DEFAULT_MASKED_IBAN);
    }

    @Test
    @Transactional
    void fullUpdateSEPABeneficiaryWithPatch() throws Exception {
        // Initialize the database
        sEPABeneficiaryRepository.saveAndFlush(sEPABeneficiary);

        int databaseSizeBeforeUpdate = sEPABeneficiaryRepository.findAll().size();

        // Update the sEPABeneficiary using partial update
        SEPABeneficiary partialUpdatedSEPABeneficiary = new SEPABeneficiary();
        partialUpdatedSEPABeneficiary.setId(sEPABeneficiary.getId());

        partialUpdatedSEPABeneficiary
            .externalId(UPDATED_EXTERNAL_ID)
            .name(UPDATED_NAME)
            .isMyOwnIban(UPDATED_IS_MY_OWN_IBAN)
            .maskedIBAN(UPDATED_MASKED_IBAN);

        restSEPABeneficiaryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSEPABeneficiary.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSEPABeneficiary))
            )
            .andExpect(status().isOk());

        // Validate the SEPABeneficiary in the database
        List<SEPABeneficiary> sEPABeneficiaryList = sEPABeneficiaryRepository.findAll();
        assertThat(sEPABeneficiaryList).hasSize(databaseSizeBeforeUpdate);
        SEPABeneficiary testSEPABeneficiary = sEPABeneficiaryList.get(sEPABeneficiaryList.size() - 1);
        assertThat(testSEPABeneficiary.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testSEPABeneficiary.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSEPABeneficiary.getIsMyOwnIban()).isEqualTo(UPDATED_IS_MY_OWN_IBAN);
        assertThat(testSEPABeneficiary.getMaskedIBAN()).isEqualTo(UPDATED_MASKED_IBAN);
    }

    @Test
    @Transactional
    void patchNonExistingSEPABeneficiary() throws Exception {
        int databaseSizeBeforeUpdate = sEPABeneficiaryRepository.findAll().size();
        sEPABeneficiary.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSEPABeneficiaryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sEPABeneficiary.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sEPABeneficiary))
            )
            .andExpect(status().isBadRequest());

        // Validate the SEPABeneficiary in the database
        List<SEPABeneficiary> sEPABeneficiaryList = sEPABeneficiaryRepository.findAll();
        assertThat(sEPABeneficiaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSEPABeneficiary() throws Exception {
        int databaseSizeBeforeUpdate = sEPABeneficiaryRepository.findAll().size();
        sEPABeneficiary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSEPABeneficiaryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sEPABeneficiary))
            )
            .andExpect(status().isBadRequest());

        // Validate the SEPABeneficiary in the database
        List<SEPABeneficiary> sEPABeneficiaryList = sEPABeneficiaryRepository.findAll();
        assertThat(sEPABeneficiaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSEPABeneficiary() throws Exception {
        int databaseSizeBeforeUpdate = sEPABeneficiaryRepository.findAll().size();
        sEPABeneficiary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSEPABeneficiaryMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sEPABeneficiary))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SEPABeneficiary in the database
        List<SEPABeneficiary> sEPABeneficiaryList = sEPABeneficiaryRepository.findAll();
        assertThat(sEPABeneficiaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSEPABeneficiary() throws Exception {
        // Initialize the database
        sEPABeneficiaryRepository.saveAndFlush(sEPABeneficiary);

        int databaseSizeBeforeDelete = sEPABeneficiaryRepository.findAll().size();

        // Delete the sEPABeneficiary
        restSEPABeneficiaryMockMvc
            .perform(delete(ENTITY_API_URL_ID, sEPABeneficiary.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SEPABeneficiary> sEPABeneficiaryList = sEPABeneficiaryRepository.findAll();
        assertThat(sEPABeneficiaryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
