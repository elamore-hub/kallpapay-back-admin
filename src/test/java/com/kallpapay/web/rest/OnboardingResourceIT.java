package com.kallpapay.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kallpapay.IntegrationTest;
import com.kallpapay.domain.Onboarding;
import com.kallpapay.repository.OnboardingRepository;
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
 * Integration tests for the {@link OnboardingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OnboardingResourceIT {

    private static final String DEFAULT_EXTERNAL_ID = "AAAAAAAAAA";
    private static final String UPDATED_EXTERNAL_ID = "BBBBBBBBBB";

    private static final String DEFAULT_ACCOUNT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ACCOUNT_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_LANGUAGE = "AAAAAAAAAA";
    private static final String UPDATED_LANGUAGE = "BBBBBBBBBB";

    private static final String DEFAULT_ACCOUNT_HOLDER_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_ACCOUNT_HOLDER_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_ONBOARDING_URL = "AAAAAAAAAA";
    private static final String UPDATED_ONBOARDING_URL = "BBBBBBBBBB";

    private static final String DEFAULT_ONBOARDING_STATE = "AAAAAAAAAA";
    private static final String UPDATED_ONBOARDING_STATE = "BBBBBBBBBB";

    private static final String DEFAULT_REDIRECT_URL = "AAAAAAAAAA";
    private static final String UPDATED_REDIRECT_URL = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_TCU_URL = "AAAAAAAAAA";
    private static final String UPDATED_TCU_URL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/onboardings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OnboardingRepository onboardingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOnboardingMockMvc;

    private Onboarding onboarding;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Onboarding createEntity(EntityManager em) {
        Onboarding onboarding = new Onboarding()
            .externalId(DEFAULT_EXTERNAL_ID)
            .accountName(DEFAULT_ACCOUNT_NAME)
            .email(DEFAULT_EMAIL)
            .language(DEFAULT_LANGUAGE)
            .accountHolderType(DEFAULT_ACCOUNT_HOLDER_TYPE)
            .onboardingUrl(DEFAULT_ONBOARDING_URL)
            .onboardingState(DEFAULT_ONBOARDING_STATE)
            .redirectUrl(DEFAULT_REDIRECT_URL)
            .status(DEFAULT_STATUS)
            .tcuUrl(DEFAULT_TCU_URL);
        return onboarding;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Onboarding createUpdatedEntity(EntityManager em) {
        Onboarding onboarding = new Onboarding()
            .externalId(UPDATED_EXTERNAL_ID)
            .accountName(UPDATED_ACCOUNT_NAME)
            .email(UPDATED_EMAIL)
            .language(UPDATED_LANGUAGE)
            .accountHolderType(UPDATED_ACCOUNT_HOLDER_TYPE)
            .onboardingUrl(UPDATED_ONBOARDING_URL)
            .onboardingState(UPDATED_ONBOARDING_STATE)
            .redirectUrl(UPDATED_REDIRECT_URL)
            .status(UPDATED_STATUS)
            .tcuUrl(UPDATED_TCU_URL);
        return onboarding;
    }

    @BeforeEach
    public void initTest() {
        onboarding = createEntity(em);
    }

    @Test
    @Transactional
    void createOnboarding() throws Exception {
        int databaseSizeBeforeCreate = onboardingRepository.findAll().size();
        // Create the Onboarding
        restOnboardingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(onboarding)))
            .andExpect(status().isCreated());

        // Validate the Onboarding in the database
        List<Onboarding> onboardingList = onboardingRepository.findAll();
        assertThat(onboardingList).hasSize(databaseSizeBeforeCreate + 1);
        Onboarding testOnboarding = onboardingList.get(onboardingList.size() - 1);
        assertThat(testOnboarding.getExternalId()).isEqualTo(DEFAULT_EXTERNAL_ID);
        assertThat(testOnboarding.getAccountName()).isEqualTo(DEFAULT_ACCOUNT_NAME);
        assertThat(testOnboarding.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testOnboarding.getLanguage()).isEqualTo(DEFAULT_LANGUAGE);
        assertThat(testOnboarding.getAccountHolderType()).isEqualTo(DEFAULT_ACCOUNT_HOLDER_TYPE);
        assertThat(testOnboarding.getOnboardingUrl()).isEqualTo(DEFAULT_ONBOARDING_URL);
        assertThat(testOnboarding.getOnboardingState()).isEqualTo(DEFAULT_ONBOARDING_STATE);
        assertThat(testOnboarding.getRedirectUrl()).isEqualTo(DEFAULT_REDIRECT_URL);
        assertThat(testOnboarding.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testOnboarding.getTcuUrl()).isEqualTo(DEFAULT_TCU_URL);
    }

    @Test
    @Transactional
    void createOnboardingWithExistingId() throws Exception {
        // Create the Onboarding with an existing ID
        onboarding.setId(1L);

        int databaseSizeBeforeCreate = onboardingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOnboardingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(onboarding)))
            .andExpect(status().isBadRequest());

        // Validate the Onboarding in the database
        List<Onboarding> onboardingList = onboardingRepository.findAll();
        assertThat(onboardingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOnboardings() throws Exception {
        // Initialize the database
        onboardingRepository.saveAndFlush(onboarding);

        // Get all the onboardingList
        restOnboardingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(onboarding.getId().intValue())))
            .andExpect(jsonPath("$.[*].externalId").value(hasItem(DEFAULT_EXTERNAL_ID)))
            .andExpect(jsonPath("$.[*].accountName").value(hasItem(DEFAULT_ACCOUNT_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].language").value(hasItem(DEFAULT_LANGUAGE)))
            .andExpect(jsonPath("$.[*].accountHolderType").value(hasItem(DEFAULT_ACCOUNT_HOLDER_TYPE)))
            .andExpect(jsonPath("$.[*].onboardingUrl").value(hasItem(DEFAULT_ONBOARDING_URL)))
            .andExpect(jsonPath("$.[*].onboardingState").value(hasItem(DEFAULT_ONBOARDING_STATE)))
            .andExpect(jsonPath("$.[*].redirectUrl").value(hasItem(DEFAULT_REDIRECT_URL)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].tcuUrl").value(hasItem(DEFAULT_TCU_URL)));
    }

    @Test
    @Transactional
    void getOnboarding() throws Exception {
        // Initialize the database
        onboardingRepository.saveAndFlush(onboarding);

        // Get the onboarding
        restOnboardingMockMvc
            .perform(get(ENTITY_API_URL_ID, onboarding.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(onboarding.getId().intValue()))
            .andExpect(jsonPath("$.externalId").value(DEFAULT_EXTERNAL_ID))
            .andExpect(jsonPath("$.accountName").value(DEFAULT_ACCOUNT_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.language").value(DEFAULT_LANGUAGE))
            .andExpect(jsonPath("$.accountHolderType").value(DEFAULT_ACCOUNT_HOLDER_TYPE))
            .andExpect(jsonPath("$.onboardingUrl").value(DEFAULT_ONBOARDING_URL))
            .andExpect(jsonPath("$.onboardingState").value(DEFAULT_ONBOARDING_STATE))
            .andExpect(jsonPath("$.redirectUrl").value(DEFAULT_REDIRECT_URL))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.tcuUrl").value(DEFAULT_TCU_URL));
    }

    @Test
    @Transactional
    void getNonExistingOnboarding() throws Exception {
        // Get the onboarding
        restOnboardingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOnboarding() throws Exception {
        // Initialize the database
        onboardingRepository.saveAndFlush(onboarding);

        int databaseSizeBeforeUpdate = onboardingRepository.findAll().size();

        // Update the onboarding
        Onboarding updatedOnboarding = onboardingRepository.findById(onboarding.getId()).get();
        // Disconnect from session so that the updates on updatedOnboarding are not directly saved in db
        em.detach(updatedOnboarding);
        updatedOnboarding
            .externalId(UPDATED_EXTERNAL_ID)
            .accountName(UPDATED_ACCOUNT_NAME)
            .email(UPDATED_EMAIL)
            .language(UPDATED_LANGUAGE)
            .accountHolderType(UPDATED_ACCOUNT_HOLDER_TYPE)
            .onboardingUrl(UPDATED_ONBOARDING_URL)
            .onboardingState(UPDATED_ONBOARDING_STATE)
            .redirectUrl(UPDATED_REDIRECT_URL)
            .status(UPDATED_STATUS)
            .tcuUrl(UPDATED_TCU_URL);

        restOnboardingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOnboarding.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOnboarding))
            )
            .andExpect(status().isOk());

        // Validate the Onboarding in the database
        List<Onboarding> onboardingList = onboardingRepository.findAll();
        assertThat(onboardingList).hasSize(databaseSizeBeforeUpdate);
        Onboarding testOnboarding = onboardingList.get(onboardingList.size() - 1);
        assertThat(testOnboarding.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testOnboarding.getAccountName()).isEqualTo(UPDATED_ACCOUNT_NAME);
        assertThat(testOnboarding.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testOnboarding.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
        assertThat(testOnboarding.getAccountHolderType()).isEqualTo(UPDATED_ACCOUNT_HOLDER_TYPE);
        assertThat(testOnboarding.getOnboardingUrl()).isEqualTo(UPDATED_ONBOARDING_URL);
        assertThat(testOnboarding.getOnboardingState()).isEqualTo(UPDATED_ONBOARDING_STATE);
        assertThat(testOnboarding.getRedirectUrl()).isEqualTo(UPDATED_REDIRECT_URL);
        assertThat(testOnboarding.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testOnboarding.getTcuUrl()).isEqualTo(UPDATED_TCU_URL);
    }

    @Test
    @Transactional
    void putNonExistingOnboarding() throws Exception {
        int databaseSizeBeforeUpdate = onboardingRepository.findAll().size();
        onboarding.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOnboardingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, onboarding.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(onboarding))
            )
            .andExpect(status().isBadRequest());

        // Validate the Onboarding in the database
        List<Onboarding> onboardingList = onboardingRepository.findAll();
        assertThat(onboardingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOnboarding() throws Exception {
        int databaseSizeBeforeUpdate = onboardingRepository.findAll().size();
        onboarding.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOnboardingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(onboarding))
            )
            .andExpect(status().isBadRequest());

        // Validate the Onboarding in the database
        List<Onboarding> onboardingList = onboardingRepository.findAll();
        assertThat(onboardingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOnboarding() throws Exception {
        int databaseSizeBeforeUpdate = onboardingRepository.findAll().size();
        onboarding.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOnboardingMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(onboarding)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Onboarding in the database
        List<Onboarding> onboardingList = onboardingRepository.findAll();
        assertThat(onboardingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOnboardingWithPatch() throws Exception {
        // Initialize the database
        onboardingRepository.saveAndFlush(onboarding);

        int databaseSizeBeforeUpdate = onboardingRepository.findAll().size();

        // Update the onboarding using partial update
        Onboarding partialUpdatedOnboarding = new Onboarding();
        partialUpdatedOnboarding.setId(onboarding.getId());

        partialUpdatedOnboarding
            .externalId(UPDATED_EXTERNAL_ID)
            .accountHolderType(UPDATED_ACCOUNT_HOLDER_TYPE)
            .onboardingState(UPDATED_ONBOARDING_STATE)
            .redirectUrl(UPDATED_REDIRECT_URL);

        restOnboardingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOnboarding.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOnboarding))
            )
            .andExpect(status().isOk());

        // Validate the Onboarding in the database
        List<Onboarding> onboardingList = onboardingRepository.findAll();
        assertThat(onboardingList).hasSize(databaseSizeBeforeUpdate);
        Onboarding testOnboarding = onboardingList.get(onboardingList.size() - 1);
        assertThat(testOnboarding.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testOnboarding.getAccountName()).isEqualTo(DEFAULT_ACCOUNT_NAME);
        assertThat(testOnboarding.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testOnboarding.getLanguage()).isEqualTo(DEFAULT_LANGUAGE);
        assertThat(testOnboarding.getAccountHolderType()).isEqualTo(UPDATED_ACCOUNT_HOLDER_TYPE);
        assertThat(testOnboarding.getOnboardingUrl()).isEqualTo(DEFAULT_ONBOARDING_URL);
        assertThat(testOnboarding.getOnboardingState()).isEqualTo(UPDATED_ONBOARDING_STATE);
        assertThat(testOnboarding.getRedirectUrl()).isEqualTo(UPDATED_REDIRECT_URL);
        assertThat(testOnboarding.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testOnboarding.getTcuUrl()).isEqualTo(DEFAULT_TCU_URL);
    }

    @Test
    @Transactional
    void fullUpdateOnboardingWithPatch() throws Exception {
        // Initialize the database
        onboardingRepository.saveAndFlush(onboarding);

        int databaseSizeBeforeUpdate = onboardingRepository.findAll().size();

        // Update the onboarding using partial update
        Onboarding partialUpdatedOnboarding = new Onboarding();
        partialUpdatedOnboarding.setId(onboarding.getId());

        partialUpdatedOnboarding
            .externalId(UPDATED_EXTERNAL_ID)
            .accountName(UPDATED_ACCOUNT_NAME)
            .email(UPDATED_EMAIL)
            .language(UPDATED_LANGUAGE)
            .accountHolderType(UPDATED_ACCOUNT_HOLDER_TYPE)
            .onboardingUrl(UPDATED_ONBOARDING_URL)
            .onboardingState(UPDATED_ONBOARDING_STATE)
            .redirectUrl(UPDATED_REDIRECT_URL)
            .status(UPDATED_STATUS)
            .tcuUrl(UPDATED_TCU_URL);

        restOnboardingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOnboarding.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOnboarding))
            )
            .andExpect(status().isOk());

        // Validate the Onboarding in the database
        List<Onboarding> onboardingList = onboardingRepository.findAll();
        assertThat(onboardingList).hasSize(databaseSizeBeforeUpdate);
        Onboarding testOnboarding = onboardingList.get(onboardingList.size() - 1);
        assertThat(testOnboarding.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testOnboarding.getAccountName()).isEqualTo(UPDATED_ACCOUNT_NAME);
        assertThat(testOnboarding.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testOnboarding.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
        assertThat(testOnboarding.getAccountHolderType()).isEqualTo(UPDATED_ACCOUNT_HOLDER_TYPE);
        assertThat(testOnboarding.getOnboardingUrl()).isEqualTo(UPDATED_ONBOARDING_URL);
        assertThat(testOnboarding.getOnboardingState()).isEqualTo(UPDATED_ONBOARDING_STATE);
        assertThat(testOnboarding.getRedirectUrl()).isEqualTo(UPDATED_REDIRECT_URL);
        assertThat(testOnboarding.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testOnboarding.getTcuUrl()).isEqualTo(UPDATED_TCU_URL);
    }

    @Test
    @Transactional
    void patchNonExistingOnboarding() throws Exception {
        int databaseSizeBeforeUpdate = onboardingRepository.findAll().size();
        onboarding.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOnboardingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, onboarding.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(onboarding))
            )
            .andExpect(status().isBadRequest());

        // Validate the Onboarding in the database
        List<Onboarding> onboardingList = onboardingRepository.findAll();
        assertThat(onboardingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOnboarding() throws Exception {
        int databaseSizeBeforeUpdate = onboardingRepository.findAll().size();
        onboarding.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOnboardingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(onboarding))
            )
            .andExpect(status().isBadRequest());

        // Validate the Onboarding in the database
        List<Onboarding> onboardingList = onboardingRepository.findAll();
        assertThat(onboardingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOnboarding() throws Exception {
        int databaseSizeBeforeUpdate = onboardingRepository.findAll().size();
        onboarding.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOnboardingMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(onboarding))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Onboarding in the database
        List<Onboarding> onboardingList = onboardingRepository.findAll();
        assertThat(onboardingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOnboarding() throws Exception {
        // Initialize the database
        onboardingRepository.saveAndFlush(onboarding);

        int databaseSizeBeforeDelete = onboardingRepository.findAll().size();

        // Delete the onboarding
        restOnboardingMockMvc
            .perform(delete(ENTITY_API_URL_ID, onboarding.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Onboarding> onboardingList = onboardingRepository.findAll();
        assertThat(onboardingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
