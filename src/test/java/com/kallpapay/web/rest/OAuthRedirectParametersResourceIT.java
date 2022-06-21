package com.kallpapay.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kallpapay.IntegrationTest;
import com.kallpapay.domain.OAuthRedirectParameters;
import com.kallpapay.repository.OAuthRedirectParametersRepository;
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
 * Integration tests for the {@link OAuthRedirectParametersResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OAuthRedirectParametersResourceIT {

    private static final String DEFAULT_STATE = "AAAAAAAAAA";
    private static final String UPDATED_STATE = "BBBBBBBBBB";

    private static final String DEFAULT_REDIRECT_URL = "AAAAAAAAAA";
    private static final String UPDATED_REDIRECT_URL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/o-auth-redirect-parameters";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OAuthRedirectParametersRepository oAuthRedirectParametersRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOAuthRedirectParametersMockMvc;

    private OAuthRedirectParameters oAuthRedirectParameters;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OAuthRedirectParameters createEntity(EntityManager em) {
        OAuthRedirectParameters oAuthRedirectParameters = new OAuthRedirectParameters()
            .state(DEFAULT_STATE)
            .redirectUrl(DEFAULT_REDIRECT_URL);
        return oAuthRedirectParameters;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OAuthRedirectParameters createUpdatedEntity(EntityManager em) {
        OAuthRedirectParameters oAuthRedirectParameters = new OAuthRedirectParameters()
            .state(UPDATED_STATE)
            .redirectUrl(UPDATED_REDIRECT_URL);
        return oAuthRedirectParameters;
    }

    @BeforeEach
    public void initTest() {
        oAuthRedirectParameters = createEntity(em);
    }

    @Test
    @Transactional
    void createOAuthRedirectParameters() throws Exception {
        int databaseSizeBeforeCreate = oAuthRedirectParametersRepository.findAll().size();
        // Create the OAuthRedirectParameters
        restOAuthRedirectParametersMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(oAuthRedirectParameters))
            )
            .andExpect(status().isCreated());

        // Validate the OAuthRedirectParameters in the database
        List<OAuthRedirectParameters> oAuthRedirectParametersList = oAuthRedirectParametersRepository.findAll();
        assertThat(oAuthRedirectParametersList).hasSize(databaseSizeBeforeCreate + 1);
        OAuthRedirectParameters testOAuthRedirectParameters = oAuthRedirectParametersList.get(oAuthRedirectParametersList.size() - 1);
        assertThat(testOAuthRedirectParameters.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testOAuthRedirectParameters.getRedirectUrl()).isEqualTo(DEFAULT_REDIRECT_URL);
    }

    @Test
    @Transactional
    void createOAuthRedirectParametersWithExistingId() throws Exception {
        // Create the OAuthRedirectParameters with an existing ID
        oAuthRedirectParameters.setId(1L);

        int databaseSizeBeforeCreate = oAuthRedirectParametersRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOAuthRedirectParametersMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(oAuthRedirectParameters))
            )
            .andExpect(status().isBadRequest());

        // Validate the OAuthRedirectParameters in the database
        List<OAuthRedirectParameters> oAuthRedirectParametersList = oAuthRedirectParametersRepository.findAll();
        assertThat(oAuthRedirectParametersList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOAuthRedirectParameters() throws Exception {
        // Initialize the database
        oAuthRedirectParametersRepository.saveAndFlush(oAuthRedirectParameters);

        // Get all the oAuthRedirectParametersList
        restOAuthRedirectParametersMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(oAuthRedirectParameters.getId().intValue())))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE)))
            .andExpect(jsonPath("$.[*].redirectUrl").value(hasItem(DEFAULT_REDIRECT_URL)));
    }

    @Test
    @Transactional
    void getOAuthRedirectParameters() throws Exception {
        // Initialize the database
        oAuthRedirectParametersRepository.saveAndFlush(oAuthRedirectParameters);

        // Get the oAuthRedirectParameters
        restOAuthRedirectParametersMockMvc
            .perform(get(ENTITY_API_URL_ID, oAuthRedirectParameters.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(oAuthRedirectParameters.getId().intValue()))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE))
            .andExpect(jsonPath("$.redirectUrl").value(DEFAULT_REDIRECT_URL));
    }

    @Test
    @Transactional
    void getNonExistingOAuthRedirectParameters() throws Exception {
        // Get the oAuthRedirectParameters
        restOAuthRedirectParametersMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOAuthRedirectParameters() throws Exception {
        // Initialize the database
        oAuthRedirectParametersRepository.saveAndFlush(oAuthRedirectParameters);

        int databaseSizeBeforeUpdate = oAuthRedirectParametersRepository.findAll().size();

        // Update the oAuthRedirectParameters
        OAuthRedirectParameters updatedOAuthRedirectParameters = oAuthRedirectParametersRepository
            .findById(oAuthRedirectParameters.getId())
            .get();
        // Disconnect from session so that the updates on updatedOAuthRedirectParameters are not directly saved in db
        em.detach(updatedOAuthRedirectParameters);
        updatedOAuthRedirectParameters.state(UPDATED_STATE).redirectUrl(UPDATED_REDIRECT_URL);

        restOAuthRedirectParametersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOAuthRedirectParameters.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOAuthRedirectParameters))
            )
            .andExpect(status().isOk());

        // Validate the OAuthRedirectParameters in the database
        List<OAuthRedirectParameters> oAuthRedirectParametersList = oAuthRedirectParametersRepository.findAll();
        assertThat(oAuthRedirectParametersList).hasSize(databaseSizeBeforeUpdate);
        OAuthRedirectParameters testOAuthRedirectParameters = oAuthRedirectParametersList.get(oAuthRedirectParametersList.size() - 1);
        assertThat(testOAuthRedirectParameters.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testOAuthRedirectParameters.getRedirectUrl()).isEqualTo(UPDATED_REDIRECT_URL);
    }

    @Test
    @Transactional
    void putNonExistingOAuthRedirectParameters() throws Exception {
        int databaseSizeBeforeUpdate = oAuthRedirectParametersRepository.findAll().size();
        oAuthRedirectParameters.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOAuthRedirectParametersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, oAuthRedirectParameters.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(oAuthRedirectParameters))
            )
            .andExpect(status().isBadRequest());

        // Validate the OAuthRedirectParameters in the database
        List<OAuthRedirectParameters> oAuthRedirectParametersList = oAuthRedirectParametersRepository.findAll();
        assertThat(oAuthRedirectParametersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOAuthRedirectParameters() throws Exception {
        int databaseSizeBeforeUpdate = oAuthRedirectParametersRepository.findAll().size();
        oAuthRedirectParameters.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOAuthRedirectParametersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(oAuthRedirectParameters))
            )
            .andExpect(status().isBadRequest());

        // Validate the OAuthRedirectParameters in the database
        List<OAuthRedirectParameters> oAuthRedirectParametersList = oAuthRedirectParametersRepository.findAll();
        assertThat(oAuthRedirectParametersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOAuthRedirectParameters() throws Exception {
        int databaseSizeBeforeUpdate = oAuthRedirectParametersRepository.findAll().size();
        oAuthRedirectParameters.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOAuthRedirectParametersMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(oAuthRedirectParameters))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OAuthRedirectParameters in the database
        List<OAuthRedirectParameters> oAuthRedirectParametersList = oAuthRedirectParametersRepository.findAll();
        assertThat(oAuthRedirectParametersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOAuthRedirectParametersWithPatch() throws Exception {
        // Initialize the database
        oAuthRedirectParametersRepository.saveAndFlush(oAuthRedirectParameters);

        int databaseSizeBeforeUpdate = oAuthRedirectParametersRepository.findAll().size();

        // Update the oAuthRedirectParameters using partial update
        OAuthRedirectParameters partialUpdatedOAuthRedirectParameters = new OAuthRedirectParameters();
        partialUpdatedOAuthRedirectParameters.setId(oAuthRedirectParameters.getId());

        partialUpdatedOAuthRedirectParameters.state(UPDATED_STATE);

        restOAuthRedirectParametersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOAuthRedirectParameters.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOAuthRedirectParameters))
            )
            .andExpect(status().isOk());

        // Validate the OAuthRedirectParameters in the database
        List<OAuthRedirectParameters> oAuthRedirectParametersList = oAuthRedirectParametersRepository.findAll();
        assertThat(oAuthRedirectParametersList).hasSize(databaseSizeBeforeUpdate);
        OAuthRedirectParameters testOAuthRedirectParameters = oAuthRedirectParametersList.get(oAuthRedirectParametersList.size() - 1);
        assertThat(testOAuthRedirectParameters.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testOAuthRedirectParameters.getRedirectUrl()).isEqualTo(DEFAULT_REDIRECT_URL);
    }

    @Test
    @Transactional
    void fullUpdateOAuthRedirectParametersWithPatch() throws Exception {
        // Initialize the database
        oAuthRedirectParametersRepository.saveAndFlush(oAuthRedirectParameters);

        int databaseSizeBeforeUpdate = oAuthRedirectParametersRepository.findAll().size();

        // Update the oAuthRedirectParameters using partial update
        OAuthRedirectParameters partialUpdatedOAuthRedirectParameters = new OAuthRedirectParameters();
        partialUpdatedOAuthRedirectParameters.setId(oAuthRedirectParameters.getId());

        partialUpdatedOAuthRedirectParameters.state(UPDATED_STATE).redirectUrl(UPDATED_REDIRECT_URL);

        restOAuthRedirectParametersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOAuthRedirectParameters.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOAuthRedirectParameters))
            )
            .andExpect(status().isOk());

        // Validate the OAuthRedirectParameters in the database
        List<OAuthRedirectParameters> oAuthRedirectParametersList = oAuthRedirectParametersRepository.findAll();
        assertThat(oAuthRedirectParametersList).hasSize(databaseSizeBeforeUpdate);
        OAuthRedirectParameters testOAuthRedirectParameters = oAuthRedirectParametersList.get(oAuthRedirectParametersList.size() - 1);
        assertThat(testOAuthRedirectParameters.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testOAuthRedirectParameters.getRedirectUrl()).isEqualTo(UPDATED_REDIRECT_URL);
    }

    @Test
    @Transactional
    void patchNonExistingOAuthRedirectParameters() throws Exception {
        int databaseSizeBeforeUpdate = oAuthRedirectParametersRepository.findAll().size();
        oAuthRedirectParameters.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOAuthRedirectParametersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, oAuthRedirectParameters.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(oAuthRedirectParameters))
            )
            .andExpect(status().isBadRequest());

        // Validate the OAuthRedirectParameters in the database
        List<OAuthRedirectParameters> oAuthRedirectParametersList = oAuthRedirectParametersRepository.findAll();
        assertThat(oAuthRedirectParametersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOAuthRedirectParameters() throws Exception {
        int databaseSizeBeforeUpdate = oAuthRedirectParametersRepository.findAll().size();
        oAuthRedirectParameters.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOAuthRedirectParametersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(oAuthRedirectParameters))
            )
            .andExpect(status().isBadRequest());

        // Validate the OAuthRedirectParameters in the database
        List<OAuthRedirectParameters> oAuthRedirectParametersList = oAuthRedirectParametersRepository.findAll();
        assertThat(oAuthRedirectParametersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOAuthRedirectParameters() throws Exception {
        int databaseSizeBeforeUpdate = oAuthRedirectParametersRepository.findAll().size();
        oAuthRedirectParameters.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOAuthRedirectParametersMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(oAuthRedirectParameters))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OAuthRedirectParameters in the database
        List<OAuthRedirectParameters> oAuthRedirectParametersList = oAuthRedirectParametersRepository.findAll();
        assertThat(oAuthRedirectParametersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOAuthRedirectParameters() throws Exception {
        // Initialize the database
        oAuthRedirectParametersRepository.saveAndFlush(oAuthRedirectParameters);

        int databaseSizeBeforeDelete = oAuthRedirectParametersRepository.findAll().size();

        // Delete the oAuthRedirectParameters
        restOAuthRedirectParametersMockMvc
            .perform(delete(ENTITY_API_URL_ID, oAuthRedirectParameters.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OAuthRedirectParameters> oAuthRedirectParametersList = oAuthRedirectParametersRepository.findAll();
        assertThat(oAuthRedirectParametersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
