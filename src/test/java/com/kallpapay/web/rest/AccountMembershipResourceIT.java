package com.kallpapay.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kallpapay.IntegrationTest;
import com.kallpapay.domain.AccountMembership;
import com.kallpapay.repository.AccountMembershipRepository;
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
 * Integration tests for the {@link AccountMembershipResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AccountMembershipResourceIT {

    private static final String DEFAULT_EXTERNAL_ID = "AAAAAAAAAA";
    private static final String UPDATED_EXTERNAL_ID = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/account-memberships";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AccountMembershipRepository accountMembershipRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAccountMembershipMockMvc;

    private AccountMembership accountMembership;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountMembership createEntity(EntityManager em) {
        AccountMembership accountMembership = new AccountMembership()
            .externalId(DEFAULT_EXTERNAL_ID)
            .email(DEFAULT_EMAIL)
            .status(DEFAULT_STATUS);
        return accountMembership;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountMembership createUpdatedEntity(EntityManager em) {
        AccountMembership accountMembership = new AccountMembership()
            .externalId(UPDATED_EXTERNAL_ID)
            .email(UPDATED_EMAIL)
            .status(UPDATED_STATUS);
        return accountMembership;
    }

    @BeforeEach
    public void initTest() {
        accountMembership = createEntity(em);
    }

    @Test
    @Transactional
    void createAccountMembership() throws Exception {
        int databaseSizeBeforeCreate = accountMembershipRepository.findAll().size();
        // Create the AccountMembership
        restAccountMembershipMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountMembership))
            )
            .andExpect(status().isCreated());

        // Validate the AccountMembership in the database
        List<AccountMembership> accountMembershipList = accountMembershipRepository.findAll();
        assertThat(accountMembershipList).hasSize(databaseSizeBeforeCreate + 1);
        AccountMembership testAccountMembership = accountMembershipList.get(accountMembershipList.size() - 1);
        assertThat(testAccountMembership.getExternalId()).isEqualTo(DEFAULT_EXTERNAL_ID);
        assertThat(testAccountMembership.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testAccountMembership.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createAccountMembershipWithExistingId() throws Exception {
        // Create the AccountMembership with an existing ID
        accountMembership.setId(1L);

        int databaseSizeBeforeCreate = accountMembershipRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAccountMembershipMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountMembership))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountMembership in the database
        List<AccountMembership> accountMembershipList = accountMembershipRepository.findAll();
        assertThat(accountMembershipList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAccountMemberships() throws Exception {
        // Initialize the database
        accountMembershipRepository.saveAndFlush(accountMembership);

        // Get all the accountMembershipList
        restAccountMembershipMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(accountMembership.getId().intValue())))
            .andExpect(jsonPath("$.[*].externalId").value(hasItem(DEFAULT_EXTERNAL_ID)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @Test
    @Transactional
    void getAccountMembership() throws Exception {
        // Initialize the database
        accountMembershipRepository.saveAndFlush(accountMembership);

        // Get the accountMembership
        restAccountMembershipMockMvc
            .perform(get(ENTITY_API_URL_ID, accountMembership.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(accountMembership.getId().intValue()))
            .andExpect(jsonPath("$.externalId").value(DEFAULT_EXTERNAL_ID))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingAccountMembership() throws Exception {
        // Get the accountMembership
        restAccountMembershipMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAccountMembership() throws Exception {
        // Initialize the database
        accountMembershipRepository.saveAndFlush(accountMembership);

        int databaseSizeBeforeUpdate = accountMembershipRepository.findAll().size();

        // Update the accountMembership
        AccountMembership updatedAccountMembership = accountMembershipRepository.findById(accountMembership.getId()).get();
        // Disconnect from session so that the updates on updatedAccountMembership are not directly saved in db
        em.detach(updatedAccountMembership);
        updatedAccountMembership.externalId(UPDATED_EXTERNAL_ID).email(UPDATED_EMAIL).status(UPDATED_STATUS);

        restAccountMembershipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAccountMembership.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAccountMembership))
            )
            .andExpect(status().isOk());

        // Validate the AccountMembership in the database
        List<AccountMembership> accountMembershipList = accountMembershipRepository.findAll();
        assertThat(accountMembershipList).hasSize(databaseSizeBeforeUpdate);
        AccountMembership testAccountMembership = accountMembershipList.get(accountMembershipList.size() - 1);
        assertThat(testAccountMembership.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testAccountMembership.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testAccountMembership.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingAccountMembership() throws Exception {
        int databaseSizeBeforeUpdate = accountMembershipRepository.findAll().size();
        accountMembership.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountMembershipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, accountMembership.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountMembership))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountMembership in the database
        List<AccountMembership> accountMembershipList = accountMembershipRepository.findAll();
        assertThat(accountMembershipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAccountMembership() throws Exception {
        int databaseSizeBeforeUpdate = accountMembershipRepository.findAll().size();
        accountMembership.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountMembershipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountMembership))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountMembership in the database
        List<AccountMembership> accountMembershipList = accountMembershipRepository.findAll();
        assertThat(accountMembershipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAccountMembership() throws Exception {
        int databaseSizeBeforeUpdate = accountMembershipRepository.findAll().size();
        accountMembership.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountMembershipMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountMembership))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AccountMembership in the database
        List<AccountMembership> accountMembershipList = accountMembershipRepository.findAll();
        assertThat(accountMembershipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAccountMembershipWithPatch() throws Exception {
        // Initialize the database
        accountMembershipRepository.saveAndFlush(accountMembership);

        int databaseSizeBeforeUpdate = accountMembershipRepository.findAll().size();

        // Update the accountMembership using partial update
        AccountMembership partialUpdatedAccountMembership = new AccountMembership();
        partialUpdatedAccountMembership.setId(accountMembership.getId());

        partialUpdatedAccountMembership.email(UPDATED_EMAIL);

        restAccountMembershipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountMembership.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccountMembership))
            )
            .andExpect(status().isOk());

        // Validate the AccountMembership in the database
        List<AccountMembership> accountMembershipList = accountMembershipRepository.findAll();
        assertThat(accountMembershipList).hasSize(databaseSizeBeforeUpdate);
        AccountMembership testAccountMembership = accountMembershipList.get(accountMembershipList.size() - 1);
        assertThat(testAccountMembership.getExternalId()).isEqualTo(DEFAULT_EXTERNAL_ID);
        assertThat(testAccountMembership.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testAccountMembership.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateAccountMembershipWithPatch() throws Exception {
        // Initialize the database
        accountMembershipRepository.saveAndFlush(accountMembership);

        int databaseSizeBeforeUpdate = accountMembershipRepository.findAll().size();

        // Update the accountMembership using partial update
        AccountMembership partialUpdatedAccountMembership = new AccountMembership();
        partialUpdatedAccountMembership.setId(accountMembership.getId());

        partialUpdatedAccountMembership.externalId(UPDATED_EXTERNAL_ID).email(UPDATED_EMAIL).status(UPDATED_STATUS);

        restAccountMembershipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountMembership.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccountMembership))
            )
            .andExpect(status().isOk());

        // Validate the AccountMembership in the database
        List<AccountMembership> accountMembershipList = accountMembershipRepository.findAll();
        assertThat(accountMembershipList).hasSize(databaseSizeBeforeUpdate);
        AccountMembership testAccountMembership = accountMembershipList.get(accountMembershipList.size() - 1);
        assertThat(testAccountMembership.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testAccountMembership.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testAccountMembership.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingAccountMembership() throws Exception {
        int databaseSizeBeforeUpdate = accountMembershipRepository.findAll().size();
        accountMembership.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountMembershipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, accountMembership.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountMembership))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountMembership in the database
        List<AccountMembership> accountMembershipList = accountMembershipRepository.findAll();
        assertThat(accountMembershipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAccountMembership() throws Exception {
        int databaseSizeBeforeUpdate = accountMembershipRepository.findAll().size();
        accountMembership.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountMembershipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountMembership))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountMembership in the database
        List<AccountMembership> accountMembershipList = accountMembershipRepository.findAll();
        assertThat(accountMembershipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAccountMembership() throws Exception {
        int databaseSizeBeforeUpdate = accountMembershipRepository.findAll().size();
        accountMembership.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountMembershipMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountMembership))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AccountMembership in the database
        List<AccountMembership> accountMembershipList = accountMembershipRepository.findAll();
        assertThat(accountMembershipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAccountMembership() throws Exception {
        // Initialize the database
        accountMembershipRepository.saveAndFlush(accountMembership);

        int databaseSizeBeforeDelete = accountMembershipRepository.findAll().size();

        // Delete the accountMembership
        restAccountMembershipMockMvc
            .perform(delete(ENTITY_API_URL_ID, accountMembership.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AccountMembership> accountMembershipList = accountMembershipRepository.findAll();
        assertThat(accountMembershipList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
