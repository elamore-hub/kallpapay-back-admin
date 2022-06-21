package com.kallpapay.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kallpapay.IntegrationTest;
import com.kallpapay.domain.AccountBalances;
import com.kallpapay.repository.AccountBalancesRepository;
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
 * Integration tests for the {@link AccountBalancesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AccountBalancesResourceIT {

    private static final String ENTITY_API_URL = "/api/account-balances";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AccountBalancesRepository accountBalancesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAccountBalancesMockMvc;

    private AccountBalances accountBalances;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountBalances createEntity(EntityManager em) {
        AccountBalances accountBalances = new AccountBalances();
        return accountBalances;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountBalances createUpdatedEntity(EntityManager em) {
        AccountBalances accountBalances = new AccountBalances();
        return accountBalances;
    }

    @BeforeEach
    public void initTest() {
        accountBalances = createEntity(em);
    }

    @Test
    @Transactional
    void createAccountBalances() throws Exception {
        int databaseSizeBeforeCreate = accountBalancesRepository.findAll().size();
        // Create the AccountBalances
        restAccountBalancesMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountBalances))
            )
            .andExpect(status().isCreated());

        // Validate the AccountBalances in the database
        List<AccountBalances> accountBalancesList = accountBalancesRepository.findAll();
        assertThat(accountBalancesList).hasSize(databaseSizeBeforeCreate + 1);
        AccountBalances testAccountBalances = accountBalancesList.get(accountBalancesList.size() - 1);
    }

    @Test
    @Transactional
    void createAccountBalancesWithExistingId() throws Exception {
        // Create the AccountBalances with an existing ID
        accountBalances.setId(1L);

        int databaseSizeBeforeCreate = accountBalancesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAccountBalancesMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountBalances))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountBalances in the database
        List<AccountBalances> accountBalancesList = accountBalancesRepository.findAll();
        assertThat(accountBalancesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAccountBalances() throws Exception {
        // Initialize the database
        accountBalancesRepository.saveAndFlush(accountBalances);

        // Get all the accountBalancesList
        restAccountBalancesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(accountBalances.getId().intValue())));
    }

    @Test
    @Transactional
    void getAccountBalances() throws Exception {
        // Initialize the database
        accountBalancesRepository.saveAndFlush(accountBalances);

        // Get the accountBalances
        restAccountBalancesMockMvc
            .perform(get(ENTITY_API_URL_ID, accountBalances.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(accountBalances.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingAccountBalances() throws Exception {
        // Get the accountBalances
        restAccountBalancesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAccountBalances() throws Exception {
        // Initialize the database
        accountBalancesRepository.saveAndFlush(accountBalances);

        int databaseSizeBeforeUpdate = accountBalancesRepository.findAll().size();

        // Update the accountBalances
        AccountBalances updatedAccountBalances = accountBalancesRepository.findById(accountBalances.getId()).get();
        // Disconnect from session so that the updates on updatedAccountBalances are not directly saved in db
        em.detach(updatedAccountBalances);

        restAccountBalancesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAccountBalances.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAccountBalances))
            )
            .andExpect(status().isOk());

        // Validate the AccountBalances in the database
        List<AccountBalances> accountBalancesList = accountBalancesRepository.findAll();
        assertThat(accountBalancesList).hasSize(databaseSizeBeforeUpdate);
        AccountBalances testAccountBalances = accountBalancesList.get(accountBalancesList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingAccountBalances() throws Exception {
        int databaseSizeBeforeUpdate = accountBalancesRepository.findAll().size();
        accountBalances.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountBalancesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, accountBalances.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountBalances))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountBalances in the database
        List<AccountBalances> accountBalancesList = accountBalancesRepository.findAll();
        assertThat(accountBalancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAccountBalances() throws Exception {
        int databaseSizeBeforeUpdate = accountBalancesRepository.findAll().size();
        accountBalances.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountBalancesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountBalances))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountBalances in the database
        List<AccountBalances> accountBalancesList = accountBalancesRepository.findAll();
        assertThat(accountBalancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAccountBalances() throws Exception {
        int databaseSizeBeforeUpdate = accountBalancesRepository.findAll().size();
        accountBalances.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountBalancesMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountBalances))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AccountBalances in the database
        List<AccountBalances> accountBalancesList = accountBalancesRepository.findAll();
        assertThat(accountBalancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAccountBalancesWithPatch() throws Exception {
        // Initialize the database
        accountBalancesRepository.saveAndFlush(accountBalances);

        int databaseSizeBeforeUpdate = accountBalancesRepository.findAll().size();

        // Update the accountBalances using partial update
        AccountBalances partialUpdatedAccountBalances = new AccountBalances();
        partialUpdatedAccountBalances.setId(accountBalances.getId());

        restAccountBalancesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountBalances.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccountBalances))
            )
            .andExpect(status().isOk());

        // Validate the AccountBalances in the database
        List<AccountBalances> accountBalancesList = accountBalancesRepository.findAll();
        assertThat(accountBalancesList).hasSize(databaseSizeBeforeUpdate);
        AccountBalances testAccountBalances = accountBalancesList.get(accountBalancesList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateAccountBalancesWithPatch() throws Exception {
        // Initialize the database
        accountBalancesRepository.saveAndFlush(accountBalances);

        int databaseSizeBeforeUpdate = accountBalancesRepository.findAll().size();

        // Update the accountBalances using partial update
        AccountBalances partialUpdatedAccountBalances = new AccountBalances();
        partialUpdatedAccountBalances.setId(accountBalances.getId());

        restAccountBalancesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountBalances.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccountBalances))
            )
            .andExpect(status().isOk());

        // Validate the AccountBalances in the database
        List<AccountBalances> accountBalancesList = accountBalancesRepository.findAll();
        assertThat(accountBalancesList).hasSize(databaseSizeBeforeUpdate);
        AccountBalances testAccountBalances = accountBalancesList.get(accountBalancesList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingAccountBalances() throws Exception {
        int databaseSizeBeforeUpdate = accountBalancesRepository.findAll().size();
        accountBalances.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountBalancesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, accountBalances.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountBalances))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountBalances in the database
        List<AccountBalances> accountBalancesList = accountBalancesRepository.findAll();
        assertThat(accountBalancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAccountBalances() throws Exception {
        int databaseSizeBeforeUpdate = accountBalancesRepository.findAll().size();
        accountBalances.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountBalancesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountBalances))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountBalances in the database
        List<AccountBalances> accountBalancesList = accountBalancesRepository.findAll();
        assertThat(accountBalancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAccountBalances() throws Exception {
        int databaseSizeBeforeUpdate = accountBalancesRepository.findAll().size();
        accountBalances.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountBalancesMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountBalances))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AccountBalances in the database
        List<AccountBalances> accountBalancesList = accountBalancesRepository.findAll();
        assertThat(accountBalancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAccountBalances() throws Exception {
        // Initialize the database
        accountBalancesRepository.saveAndFlush(accountBalances);

        int databaseSizeBeforeDelete = accountBalancesRepository.findAll().size();

        // Delete the accountBalances
        restAccountBalancesMockMvc
            .perform(delete(ENTITY_API_URL_ID, accountBalances.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AccountBalances> accountBalancesList = accountBalancesRepository.findAll();
        assertThat(accountBalancesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
