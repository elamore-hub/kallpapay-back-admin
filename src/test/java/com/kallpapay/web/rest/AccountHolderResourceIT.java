package com.kallpapay.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kallpapay.IntegrationTest;
import com.kallpapay.domain.AccountHolder;
import com.kallpapay.repository.AccountHolderRepository;
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
 * Integration tests for the {@link AccountHolderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AccountHolderResourceIT {

    private static final String DEFAULT_EXTERNAL_ID = "AAAAAAAAAA";
    private static final String UPDATED_EXTERNAL_ID = "BBBBBBBBBB";

    private static final String DEFAULT_VERIFICATION_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_VERIFICATION_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS_INFO = "AAAAAAAAAA";
    private static final String UPDATED_STATUS_INFO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/account-holders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AccountHolderRepository accountHolderRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAccountHolderMockMvc;

    private AccountHolder accountHolder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountHolder createEntity(EntityManager em) {
        AccountHolder accountHolder = new AccountHolder()
            .externalId(DEFAULT_EXTERNAL_ID)
            .verificationStatus(DEFAULT_VERIFICATION_STATUS)
            .statusInfo(DEFAULT_STATUS_INFO);
        return accountHolder;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountHolder createUpdatedEntity(EntityManager em) {
        AccountHolder accountHolder = new AccountHolder()
            .externalId(UPDATED_EXTERNAL_ID)
            .verificationStatus(UPDATED_VERIFICATION_STATUS)
            .statusInfo(UPDATED_STATUS_INFO);
        return accountHolder;
    }

    @BeforeEach
    public void initTest() {
        accountHolder = createEntity(em);
    }

    @Test
    @Transactional
    void createAccountHolder() throws Exception {
        int databaseSizeBeforeCreate = accountHolderRepository.findAll().size();
        // Create the AccountHolder
        restAccountHolderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountHolder)))
            .andExpect(status().isCreated());

        // Validate the AccountHolder in the database
        List<AccountHolder> accountHolderList = accountHolderRepository.findAll();
        assertThat(accountHolderList).hasSize(databaseSizeBeforeCreate + 1);
        AccountHolder testAccountHolder = accountHolderList.get(accountHolderList.size() - 1);
        assertThat(testAccountHolder.getExternalId()).isEqualTo(DEFAULT_EXTERNAL_ID);
        assertThat(testAccountHolder.getVerificationStatus()).isEqualTo(DEFAULT_VERIFICATION_STATUS);
        assertThat(testAccountHolder.getStatusInfo()).isEqualTo(DEFAULT_STATUS_INFO);
    }

    @Test
    @Transactional
    void createAccountHolderWithExistingId() throws Exception {
        // Create the AccountHolder with an existing ID
        accountHolder.setId(1L);

        int databaseSizeBeforeCreate = accountHolderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAccountHolderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountHolder)))
            .andExpect(status().isBadRequest());

        // Validate the AccountHolder in the database
        List<AccountHolder> accountHolderList = accountHolderRepository.findAll();
        assertThat(accountHolderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAccountHolders() throws Exception {
        // Initialize the database
        accountHolderRepository.saveAndFlush(accountHolder);

        // Get all the accountHolderList
        restAccountHolderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(accountHolder.getId().intValue())))
            .andExpect(jsonPath("$.[*].externalId").value(hasItem(DEFAULT_EXTERNAL_ID)))
            .andExpect(jsonPath("$.[*].verificationStatus").value(hasItem(DEFAULT_VERIFICATION_STATUS)))
            .andExpect(jsonPath("$.[*].statusInfo").value(hasItem(DEFAULT_STATUS_INFO)));
    }

    @Test
    @Transactional
    void getAccountHolder() throws Exception {
        // Initialize the database
        accountHolderRepository.saveAndFlush(accountHolder);

        // Get the accountHolder
        restAccountHolderMockMvc
            .perform(get(ENTITY_API_URL_ID, accountHolder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(accountHolder.getId().intValue()))
            .andExpect(jsonPath("$.externalId").value(DEFAULT_EXTERNAL_ID))
            .andExpect(jsonPath("$.verificationStatus").value(DEFAULT_VERIFICATION_STATUS))
            .andExpect(jsonPath("$.statusInfo").value(DEFAULT_STATUS_INFO));
    }

    @Test
    @Transactional
    void getNonExistingAccountHolder() throws Exception {
        // Get the accountHolder
        restAccountHolderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAccountHolder() throws Exception {
        // Initialize the database
        accountHolderRepository.saveAndFlush(accountHolder);

        int databaseSizeBeforeUpdate = accountHolderRepository.findAll().size();

        // Update the accountHolder
        AccountHolder updatedAccountHolder = accountHolderRepository.findById(accountHolder.getId()).get();
        // Disconnect from session so that the updates on updatedAccountHolder are not directly saved in db
        em.detach(updatedAccountHolder);
        updatedAccountHolder
            .externalId(UPDATED_EXTERNAL_ID)
            .verificationStatus(UPDATED_VERIFICATION_STATUS)
            .statusInfo(UPDATED_STATUS_INFO);

        restAccountHolderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAccountHolder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAccountHolder))
            )
            .andExpect(status().isOk());

        // Validate the AccountHolder in the database
        List<AccountHolder> accountHolderList = accountHolderRepository.findAll();
        assertThat(accountHolderList).hasSize(databaseSizeBeforeUpdate);
        AccountHolder testAccountHolder = accountHolderList.get(accountHolderList.size() - 1);
        assertThat(testAccountHolder.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testAccountHolder.getVerificationStatus()).isEqualTo(UPDATED_VERIFICATION_STATUS);
        assertThat(testAccountHolder.getStatusInfo()).isEqualTo(UPDATED_STATUS_INFO);
    }

    @Test
    @Transactional
    void putNonExistingAccountHolder() throws Exception {
        int databaseSizeBeforeUpdate = accountHolderRepository.findAll().size();
        accountHolder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountHolderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, accountHolder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountHolder))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountHolder in the database
        List<AccountHolder> accountHolderList = accountHolderRepository.findAll();
        assertThat(accountHolderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAccountHolder() throws Exception {
        int databaseSizeBeforeUpdate = accountHolderRepository.findAll().size();
        accountHolder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountHolderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountHolder))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountHolder in the database
        List<AccountHolder> accountHolderList = accountHolderRepository.findAll();
        assertThat(accountHolderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAccountHolder() throws Exception {
        int databaseSizeBeforeUpdate = accountHolderRepository.findAll().size();
        accountHolder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountHolderMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountHolder)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AccountHolder in the database
        List<AccountHolder> accountHolderList = accountHolderRepository.findAll();
        assertThat(accountHolderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAccountHolderWithPatch() throws Exception {
        // Initialize the database
        accountHolderRepository.saveAndFlush(accountHolder);

        int databaseSizeBeforeUpdate = accountHolderRepository.findAll().size();

        // Update the accountHolder using partial update
        AccountHolder partialUpdatedAccountHolder = new AccountHolder();
        partialUpdatedAccountHolder.setId(accountHolder.getId());

        partialUpdatedAccountHolder.externalId(UPDATED_EXTERNAL_ID).verificationStatus(UPDATED_VERIFICATION_STATUS);

        restAccountHolderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountHolder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccountHolder))
            )
            .andExpect(status().isOk());

        // Validate the AccountHolder in the database
        List<AccountHolder> accountHolderList = accountHolderRepository.findAll();
        assertThat(accountHolderList).hasSize(databaseSizeBeforeUpdate);
        AccountHolder testAccountHolder = accountHolderList.get(accountHolderList.size() - 1);
        assertThat(testAccountHolder.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testAccountHolder.getVerificationStatus()).isEqualTo(UPDATED_VERIFICATION_STATUS);
        assertThat(testAccountHolder.getStatusInfo()).isEqualTo(DEFAULT_STATUS_INFO);
    }

    @Test
    @Transactional
    void fullUpdateAccountHolderWithPatch() throws Exception {
        // Initialize the database
        accountHolderRepository.saveAndFlush(accountHolder);

        int databaseSizeBeforeUpdate = accountHolderRepository.findAll().size();

        // Update the accountHolder using partial update
        AccountHolder partialUpdatedAccountHolder = new AccountHolder();
        partialUpdatedAccountHolder.setId(accountHolder.getId());

        partialUpdatedAccountHolder
            .externalId(UPDATED_EXTERNAL_ID)
            .verificationStatus(UPDATED_VERIFICATION_STATUS)
            .statusInfo(UPDATED_STATUS_INFO);

        restAccountHolderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountHolder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccountHolder))
            )
            .andExpect(status().isOk());

        // Validate the AccountHolder in the database
        List<AccountHolder> accountHolderList = accountHolderRepository.findAll();
        assertThat(accountHolderList).hasSize(databaseSizeBeforeUpdate);
        AccountHolder testAccountHolder = accountHolderList.get(accountHolderList.size() - 1);
        assertThat(testAccountHolder.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testAccountHolder.getVerificationStatus()).isEqualTo(UPDATED_VERIFICATION_STATUS);
        assertThat(testAccountHolder.getStatusInfo()).isEqualTo(UPDATED_STATUS_INFO);
    }

    @Test
    @Transactional
    void patchNonExistingAccountHolder() throws Exception {
        int databaseSizeBeforeUpdate = accountHolderRepository.findAll().size();
        accountHolder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountHolderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, accountHolder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountHolder))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountHolder in the database
        List<AccountHolder> accountHolderList = accountHolderRepository.findAll();
        assertThat(accountHolderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAccountHolder() throws Exception {
        int databaseSizeBeforeUpdate = accountHolderRepository.findAll().size();
        accountHolder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountHolderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountHolder))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountHolder in the database
        List<AccountHolder> accountHolderList = accountHolderRepository.findAll();
        assertThat(accountHolderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAccountHolder() throws Exception {
        int databaseSizeBeforeUpdate = accountHolderRepository.findAll().size();
        accountHolder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountHolderMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(accountHolder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AccountHolder in the database
        List<AccountHolder> accountHolderList = accountHolderRepository.findAll();
        assertThat(accountHolderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAccountHolder() throws Exception {
        // Initialize the database
        accountHolderRepository.saveAndFlush(accountHolder);

        int databaseSizeBeforeDelete = accountHolderRepository.findAll().size();

        // Delete the accountHolder
        restAccountHolderMockMvc
            .perform(delete(ENTITY_API_URL_ID, accountHolder.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AccountHolder> accountHolderList = accountHolderRepository.findAll();
        assertThat(accountHolderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
