package com.kallpapay.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kallpapay.IntegrationTest;
import com.kallpapay.domain.SupportingDocument;
import com.kallpapay.repository.SupportingDocumentRepository;
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
 * Integration tests for the {@link SupportingDocumentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SupportingDocumentResourceIT {

    private static final String DEFAULT_EXTERNAL_ID = "AAAAAAAAAA";
    private static final String UPDATED_EXTERNAL_ID = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_SUPPORTING_DOCUMENT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_SUPPORTING_DOCUMENT_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_SUPPORTING_DOCUMENT_PURPOSE = "AAAAAAAAAA";
    private static final String UPDATED_SUPPORTING_DOCUMENT_PURPOSE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/supporting-documents";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SupportingDocumentRepository supportingDocumentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSupportingDocumentMockMvc;

    private SupportingDocument supportingDocument;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SupportingDocument createEntity(EntityManager em) {
        SupportingDocument supportingDocument = new SupportingDocument()
            .externalId(DEFAULT_EXTERNAL_ID)
            .status(DEFAULT_STATUS)
            .supportingDocumentType(DEFAULT_SUPPORTING_DOCUMENT_TYPE)
            .supportingDocumentPurpose(DEFAULT_SUPPORTING_DOCUMENT_PURPOSE);
        return supportingDocument;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SupportingDocument createUpdatedEntity(EntityManager em) {
        SupportingDocument supportingDocument = new SupportingDocument()
            .externalId(UPDATED_EXTERNAL_ID)
            .status(UPDATED_STATUS)
            .supportingDocumentType(UPDATED_SUPPORTING_DOCUMENT_TYPE)
            .supportingDocumentPurpose(UPDATED_SUPPORTING_DOCUMENT_PURPOSE);
        return supportingDocument;
    }

    @BeforeEach
    public void initTest() {
        supportingDocument = createEntity(em);
    }

    @Test
    @Transactional
    void createSupportingDocument() throws Exception {
        int databaseSizeBeforeCreate = supportingDocumentRepository.findAll().size();
        // Create the SupportingDocument
        restSupportingDocumentMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(supportingDocument))
            )
            .andExpect(status().isCreated());

        // Validate the SupportingDocument in the database
        List<SupportingDocument> supportingDocumentList = supportingDocumentRepository.findAll();
        assertThat(supportingDocumentList).hasSize(databaseSizeBeforeCreate + 1);
        SupportingDocument testSupportingDocument = supportingDocumentList.get(supportingDocumentList.size() - 1);
        assertThat(testSupportingDocument.getExternalId()).isEqualTo(DEFAULT_EXTERNAL_ID);
        assertThat(testSupportingDocument.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testSupportingDocument.getSupportingDocumentType()).isEqualTo(DEFAULT_SUPPORTING_DOCUMENT_TYPE);
        assertThat(testSupportingDocument.getSupportingDocumentPurpose()).isEqualTo(DEFAULT_SUPPORTING_DOCUMENT_PURPOSE);
    }

    @Test
    @Transactional
    void createSupportingDocumentWithExistingId() throws Exception {
        // Create the SupportingDocument with an existing ID
        supportingDocument.setId(1L);

        int databaseSizeBeforeCreate = supportingDocumentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSupportingDocumentMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(supportingDocument))
            )
            .andExpect(status().isBadRequest());

        // Validate the SupportingDocument in the database
        List<SupportingDocument> supportingDocumentList = supportingDocumentRepository.findAll();
        assertThat(supportingDocumentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSupportingDocuments() throws Exception {
        // Initialize the database
        supportingDocumentRepository.saveAndFlush(supportingDocument);

        // Get all the supportingDocumentList
        restSupportingDocumentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(supportingDocument.getId().intValue())))
            .andExpect(jsonPath("$.[*].externalId").value(hasItem(DEFAULT_EXTERNAL_ID)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].supportingDocumentType").value(hasItem(DEFAULT_SUPPORTING_DOCUMENT_TYPE)))
            .andExpect(jsonPath("$.[*].supportingDocumentPurpose").value(hasItem(DEFAULT_SUPPORTING_DOCUMENT_PURPOSE)));
    }

    @Test
    @Transactional
    void getSupportingDocument() throws Exception {
        // Initialize the database
        supportingDocumentRepository.saveAndFlush(supportingDocument);

        // Get the supportingDocument
        restSupportingDocumentMockMvc
            .perform(get(ENTITY_API_URL_ID, supportingDocument.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(supportingDocument.getId().intValue()))
            .andExpect(jsonPath("$.externalId").value(DEFAULT_EXTERNAL_ID))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.supportingDocumentType").value(DEFAULT_SUPPORTING_DOCUMENT_TYPE))
            .andExpect(jsonPath("$.supportingDocumentPurpose").value(DEFAULT_SUPPORTING_DOCUMENT_PURPOSE));
    }

    @Test
    @Transactional
    void getNonExistingSupportingDocument() throws Exception {
        // Get the supportingDocument
        restSupportingDocumentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSupportingDocument() throws Exception {
        // Initialize the database
        supportingDocumentRepository.saveAndFlush(supportingDocument);

        int databaseSizeBeforeUpdate = supportingDocumentRepository.findAll().size();

        // Update the supportingDocument
        SupportingDocument updatedSupportingDocument = supportingDocumentRepository.findById(supportingDocument.getId()).get();
        // Disconnect from session so that the updates on updatedSupportingDocument are not directly saved in db
        em.detach(updatedSupportingDocument);
        updatedSupportingDocument
            .externalId(UPDATED_EXTERNAL_ID)
            .status(UPDATED_STATUS)
            .supportingDocumentType(UPDATED_SUPPORTING_DOCUMENT_TYPE)
            .supportingDocumentPurpose(UPDATED_SUPPORTING_DOCUMENT_PURPOSE);

        restSupportingDocumentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSupportingDocument.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSupportingDocument))
            )
            .andExpect(status().isOk());

        // Validate the SupportingDocument in the database
        List<SupportingDocument> supportingDocumentList = supportingDocumentRepository.findAll();
        assertThat(supportingDocumentList).hasSize(databaseSizeBeforeUpdate);
        SupportingDocument testSupportingDocument = supportingDocumentList.get(supportingDocumentList.size() - 1);
        assertThat(testSupportingDocument.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testSupportingDocument.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSupportingDocument.getSupportingDocumentType()).isEqualTo(UPDATED_SUPPORTING_DOCUMENT_TYPE);
        assertThat(testSupportingDocument.getSupportingDocumentPurpose()).isEqualTo(UPDATED_SUPPORTING_DOCUMENT_PURPOSE);
    }

    @Test
    @Transactional
    void putNonExistingSupportingDocument() throws Exception {
        int databaseSizeBeforeUpdate = supportingDocumentRepository.findAll().size();
        supportingDocument.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSupportingDocumentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, supportingDocument.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(supportingDocument))
            )
            .andExpect(status().isBadRequest());

        // Validate the SupportingDocument in the database
        List<SupportingDocument> supportingDocumentList = supportingDocumentRepository.findAll();
        assertThat(supportingDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSupportingDocument() throws Exception {
        int databaseSizeBeforeUpdate = supportingDocumentRepository.findAll().size();
        supportingDocument.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSupportingDocumentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(supportingDocument))
            )
            .andExpect(status().isBadRequest());

        // Validate the SupportingDocument in the database
        List<SupportingDocument> supportingDocumentList = supportingDocumentRepository.findAll();
        assertThat(supportingDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSupportingDocument() throws Exception {
        int databaseSizeBeforeUpdate = supportingDocumentRepository.findAll().size();
        supportingDocument.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSupportingDocumentMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(supportingDocument))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SupportingDocument in the database
        List<SupportingDocument> supportingDocumentList = supportingDocumentRepository.findAll();
        assertThat(supportingDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSupportingDocumentWithPatch() throws Exception {
        // Initialize the database
        supportingDocumentRepository.saveAndFlush(supportingDocument);

        int databaseSizeBeforeUpdate = supportingDocumentRepository.findAll().size();

        // Update the supportingDocument using partial update
        SupportingDocument partialUpdatedSupportingDocument = new SupportingDocument();
        partialUpdatedSupportingDocument.setId(supportingDocument.getId());

        partialUpdatedSupportingDocument
            .externalId(UPDATED_EXTERNAL_ID)
            .status(UPDATED_STATUS)
            .supportingDocumentPurpose(UPDATED_SUPPORTING_DOCUMENT_PURPOSE);

        restSupportingDocumentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSupportingDocument.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSupportingDocument))
            )
            .andExpect(status().isOk());

        // Validate the SupportingDocument in the database
        List<SupportingDocument> supportingDocumentList = supportingDocumentRepository.findAll();
        assertThat(supportingDocumentList).hasSize(databaseSizeBeforeUpdate);
        SupportingDocument testSupportingDocument = supportingDocumentList.get(supportingDocumentList.size() - 1);
        assertThat(testSupportingDocument.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testSupportingDocument.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSupportingDocument.getSupportingDocumentType()).isEqualTo(DEFAULT_SUPPORTING_DOCUMENT_TYPE);
        assertThat(testSupportingDocument.getSupportingDocumentPurpose()).isEqualTo(UPDATED_SUPPORTING_DOCUMENT_PURPOSE);
    }

    @Test
    @Transactional
    void fullUpdateSupportingDocumentWithPatch() throws Exception {
        // Initialize the database
        supportingDocumentRepository.saveAndFlush(supportingDocument);

        int databaseSizeBeforeUpdate = supportingDocumentRepository.findAll().size();

        // Update the supportingDocument using partial update
        SupportingDocument partialUpdatedSupportingDocument = new SupportingDocument();
        partialUpdatedSupportingDocument.setId(supportingDocument.getId());

        partialUpdatedSupportingDocument
            .externalId(UPDATED_EXTERNAL_ID)
            .status(UPDATED_STATUS)
            .supportingDocumentType(UPDATED_SUPPORTING_DOCUMENT_TYPE)
            .supportingDocumentPurpose(UPDATED_SUPPORTING_DOCUMENT_PURPOSE);

        restSupportingDocumentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSupportingDocument.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSupportingDocument))
            )
            .andExpect(status().isOk());

        // Validate the SupportingDocument in the database
        List<SupportingDocument> supportingDocumentList = supportingDocumentRepository.findAll();
        assertThat(supportingDocumentList).hasSize(databaseSizeBeforeUpdate);
        SupportingDocument testSupportingDocument = supportingDocumentList.get(supportingDocumentList.size() - 1);
        assertThat(testSupportingDocument.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testSupportingDocument.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSupportingDocument.getSupportingDocumentType()).isEqualTo(UPDATED_SUPPORTING_DOCUMENT_TYPE);
        assertThat(testSupportingDocument.getSupportingDocumentPurpose()).isEqualTo(UPDATED_SUPPORTING_DOCUMENT_PURPOSE);
    }

    @Test
    @Transactional
    void patchNonExistingSupportingDocument() throws Exception {
        int databaseSizeBeforeUpdate = supportingDocumentRepository.findAll().size();
        supportingDocument.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSupportingDocumentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, supportingDocument.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(supportingDocument))
            )
            .andExpect(status().isBadRequest());

        // Validate the SupportingDocument in the database
        List<SupportingDocument> supportingDocumentList = supportingDocumentRepository.findAll();
        assertThat(supportingDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSupportingDocument() throws Exception {
        int databaseSizeBeforeUpdate = supportingDocumentRepository.findAll().size();
        supportingDocument.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSupportingDocumentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(supportingDocument))
            )
            .andExpect(status().isBadRequest());

        // Validate the SupportingDocument in the database
        List<SupportingDocument> supportingDocumentList = supportingDocumentRepository.findAll();
        assertThat(supportingDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSupportingDocument() throws Exception {
        int databaseSizeBeforeUpdate = supportingDocumentRepository.findAll().size();
        supportingDocument.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSupportingDocumentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(supportingDocument))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SupportingDocument in the database
        List<SupportingDocument> supportingDocumentList = supportingDocumentRepository.findAll();
        assertThat(supportingDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSupportingDocument() throws Exception {
        // Initialize the database
        supportingDocumentRepository.saveAndFlush(supportingDocument);

        int databaseSizeBeforeDelete = supportingDocumentRepository.findAll().size();

        // Delete the supportingDocument
        restSupportingDocumentMockMvc
            .perform(delete(ENTITY_API_URL_ID, supportingDocument.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SupportingDocument> supportingDocumentList = supportingDocumentRepository.findAll();
        assertThat(supportingDocumentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
