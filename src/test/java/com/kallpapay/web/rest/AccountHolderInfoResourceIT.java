package com.kallpapay.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kallpapay.IntegrationTest;
import com.kallpapay.domain.AccountHolderInfo;
import com.kallpapay.repository.AccountHolderInfoRepository;
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
 * Integration tests for the {@link AccountHolderInfoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AccountHolderInfoResourceIT {

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/account-holder-infos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AccountHolderInfoRepository accountHolderInfoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAccountHolderInfoMockMvc;

    private AccountHolderInfo accountHolderInfo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountHolderInfo createEntity(EntityManager em) {
        AccountHolderInfo accountHolderInfo = new AccountHolderInfo().type(DEFAULT_TYPE).name(DEFAULT_NAME);
        return accountHolderInfo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AccountHolderInfo createUpdatedEntity(EntityManager em) {
        AccountHolderInfo accountHolderInfo = new AccountHolderInfo().type(UPDATED_TYPE).name(UPDATED_NAME);
        return accountHolderInfo;
    }

    @BeforeEach
    public void initTest() {
        accountHolderInfo = createEntity(em);
    }

    @Test
    @Transactional
    void createAccountHolderInfo() throws Exception {
        int databaseSizeBeforeCreate = accountHolderInfoRepository.findAll().size();
        // Create the AccountHolderInfo
        restAccountHolderInfoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountHolderInfo))
            )
            .andExpect(status().isCreated());

        // Validate the AccountHolderInfo in the database
        List<AccountHolderInfo> accountHolderInfoList = accountHolderInfoRepository.findAll();
        assertThat(accountHolderInfoList).hasSize(databaseSizeBeforeCreate + 1);
        AccountHolderInfo testAccountHolderInfo = accountHolderInfoList.get(accountHolderInfoList.size() - 1);
        assertThat(testAccountHolderInfo.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAccountHolderInfo.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createAccountHolderInfoWithExistingId() throws Exception {
        // Create the AccountHolderInfo with an existing ID
        accountHolderInfo.setId(1L);

        int databaseSizeBeforeCreate = accountHolderInfoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAccountHolderInfoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountHolderInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountHolderInfo in the database
        List<AccountHolderInfo> accountHolderInfoList = accountHolderInfoRepository.findAll();
        assertThat(accountHolderInfoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAccountHolderInfos() throws Exception {
        // Initialize the database
        accountHolderInfoRepository.saveAndFlush(accountHolderInfo);

        // Get all the accountHolderInfoList
        restAccountHolderInfoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(accountHolderInfo.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getAccountHolderInfo() throws Exception {
        // Initialize the database
        accountHolderInfoRepository.saveAndFlush(accountHolderInfo);

        // Get the accountHolderInfo
        restAccountHolderInfoMockMvc
            .perform(get(ENTITY_API_URL_ID, accountHolderInfo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(accountHolderInfo.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingAccountHolderInfo() throws Exception {
        // Get the accountHolderInfo
        restAccountHolderInfoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAccountHolderInfo() throws Exception {
        // Initialize the database
        accountHolderInfoRepository.saveAndFlush(accountHolderInfo);

        int databaseSizeBeforeUpdate = accountHolderInfoRepository.findAll().size();

        // Update the accountHolderInfo
        AccountHolderInfo updatedAccountHolderInfo = accountHolderInfoRepository.findById(accountHolderInfo.getId()).get();
        // Disconnect from session so that the updates on updatedAccountHolderInfo are not directly saved in db
        em.detach(updatedAccountHolderInfo);
        updatedAccountHolderInfo.type(UPDATED_TYPE).name(UPDATED_NAME);

        restAccountHolderInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAccountHolderInfo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAccountHolderInfo))
            )
            .andExpect(status().isOk());

        // Validate the AccountHolderInfo in the database
        List<AccountHolderInfo> accountHolderInfoList = accountHolderInfoRepository.findAll();
        assertThat(accountHolderInfoList).hasSize(databaseSizeBeforeUpdate);
        AccountHolderInfo testAccountHolderInfo = accountHolderInfoList.get(accountHolderInfoList.size() - 1);
        assertThat(testAccountHolderInfo.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAccountHolderInfo.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingAccountHolderInfo() throws Exception {
        int databaseSizeBeforeUpdate = accountHolderInfoRepository.findAll().size();
        accountHolderInfo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountHolderInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, accountHolderInfo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountHolderInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountHolderInfo in the database
        List<AccountHolderInfo> accountHolderInfoList = accountHolderInfoRepository.findAll();
        assertThat(accountHolderInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAccountHolderInfo() throws Exception {
        int databaseSizeBeforeUpdate = accountHolderInfoRepository.findAll().size();
        accountHolderInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountHolderInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accountHolderInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountHolderInfo in the database
        List<AccountHolderInfo> accountHolderInfoList = accountHolderInfoRepository.findAll();
        assertThat(accountHolderInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAccountHolderInfo() throws Exception {
        int databaseSizeBeforeUpdate = accountHolderInfoRepository.findAll().size();
        accountHolderInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountHolderInfoMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accountHolderInfo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AccountHolderInfo in the database
        List<AccountHolderInfo> accountHolderInfoList = accountHolderInfoRepository.findAll();
        assertThat(accountHolderInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAccountHolderInfoWithPatch() throws Exception {
        // Initialize the database
        accountHolderInfoRepository.saveAndFlush(accountHolderInfo);

        int databaseSizeBeforeUpdate = accountHolderInfoRepository.findAll().size();

        // Update the accountHolderInfo using partial update
        AccountHolderInfo partialUpdatedAccountHolderInfo = new AccountHolderInfo();
        partialUpdatedAccountHolderInfo.setId(accountHolderInfo.getId());

        restAccountHolderInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountHolderInfo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccountHolderInfo))
            )
            .andExpect(status().isOk());

        // Validate the AccountHolderInfo in the database
        List<AccountHolderInfo> accountHolderInfoList = accountHolderInfoRepository.findAll();
        assertThat(accountHolderInfoList).hasSize(databaseSizeBeforeUpdate);
        AccountHolderInfo testAccountHolderInfo = accountHolderInfoList.get(accountHolderInfoList.size() - 1);
        assertThat(testAccountHolderInfo.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAccountHolderInfo.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateAccountHolderInfoWithPatch() throws Exception {
        // Initialize the database
        accountHolderInfoRepository.saveAndFlush(accountHolderInfo);

        int databaseSizeBeforeUpdate = accountHolderInfoRepository.findAll().size();

        // Update the accountHolderInfo using partial update
        AccountHolderInfo partialUpdatedAccountHolderInfo = new AccountHolderInfo();
        partialUpdatedAccountHolderInfo.setId(accountHolderInfo.getId());

        partialUpdatedAccountHolderInfo.type(UPDATED_TYPE).name(UPDATED_NAME);

        restAccountHolderInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccountHolderInfo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccountHolderInfo))
            )
            .andExpect(status().isOk());

        // Validate the AccountHolderInfo in the database
        List<AccountHolderInfo> accountHolderInfoList = accountHolderInfoRepository.findAll();
        assertThat(accountHolderInfoList).hasSize(databaseSizeBeforeUpdate);
        AccountHolderInfo testAccountHolderInfo = accountHolderInfoList.get(accountHolderInfoList.size() - 1);
        assertThat(testAccountHolderInfo.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAccountHolderInfo.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingAccountHolderInfo() throws Exception {
        int databaseSizeBeforeUpdate = accountHolderInfoRepository.findAll().size();
        accountHolderInfo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccountHolderInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, accountHolderInfo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountHolderInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountHolderInfo in the database
        List<AccountHolderInfo> accountHolderInfoList = accountHolderInfoRepository.findAll();
        assertThat(accountHolderInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAccountHolderInfo() throws Exception {
        int databaseSizeBeforeUpdate = accountHolderInfoRepository.findAll().size();
        accountHolderInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountHolderInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountHolderInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the AccountHolderInfo in the database
        List<AccountHolderInfo> accountHolderInfoList = accountHolderInfoRepository.findAll();
        assertThat(accountHolderInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAccountHolderInfo() throws Exception {
        int databaseSizeBeforeUpdate = accountHolderInfoRepository.findAll().size();
        accountHolderInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccountHolderInfoMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accountHolderInfo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AccountHolderInfo in the database
        List<AccountHolderInfo> accountHolderInfoList = accountHolderInfoRepository.findAll();
        assertThat(accountHolderInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAccountHolderInfo() throws Exception {
        // Initialize the database
        accountHolderInfoRepository.saveAndFlush(accountHolderInfo);

        int databaseSizeBeforeDelete = accountHolderInfoRepository.findAll().size();

        // Delete the accountHolderInfo
        restAccountHolderInfoMockMvc
            .perform(delete(ENTITY_API_URL_ID, accountHolderInfo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AccountHolderInfo> accountHolderInfoList = accountHolderInfoRepository.findAll();
        assertThat(accountHolderInfoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
