package com.kallpapay.web.rest;

import com.kallpapay.domain.SupportingDocument;
import com.kallpapay.repository.SupportingDocumentRepository;
import com.kallpapay.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.kallpapay.domain.SupportingDocument}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SupportingDocumentResource {

    private final Logger log = LoggerFactory.getLogger(SupportingDocumentResource.class);

    private static final String ENTITY_NAME = "supportingDocument";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SupportingDocumentRepository supportingDocumentRepository;

    public SupportingDocumentResource(SupportingDocumentRepository supportingDocumentRepository) {
        this.supportingDocumentRepository = supportingDocumentRepository;
    }

    /**
     * {@code POST  /supporting-documents} : Create a new supportingDocument.
     *
     * @param supportingDocument the supportingDocument to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new supportingDocument, or with status {@code 400 (Bad Request)} if the supportingDocument has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/supporting-documents")
    public ResponseEntity<SupportingDocument> createSupportingDocument(@RequestBody SupportingDocument supportingDocument)
        throws URISyntaxException {
        log.debug("REST request to save SupportingDocument : {}", supportingDocument);
        if (supportingDocument.getId() != null) {
            throw new BadRequestAlertException("A new supportingDocument cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SupportingDocument result = supportingDocumentRepository.save(supportingDocument);
        return ResponseEntity
            .created(new URI("/api/supporting-documents/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /supporting-documents/:id} : Updates an existing supportingDocument.
     *
     * @param id the id of the supportingDocument to save.
     * @param supportingDocument the supportingDocument to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated supportingDocument,
     * or with status {@code 400 (Bad Request)} if the supportingDocument is not valid,
     * or with status {@code 500 (Internal Server Error)} if the supportingDocument couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/supporting-documents/{id}")
    public ResponseEntity<SupportingDocument> updateSupportingDocument(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SupportingDocument supportingDocument
    ) throws URISyntaxException {
        log.debug("REST request to update SupportingDocument : {}, {}", id, supportingDocument);
        if (supportingDocument.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, supportingDocument.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!supportingDocumentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SupportingDocument result = supportingDocumentRepository.save(supportingDocument);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, supportingDocument.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /supporting-documents/:id} : Partial updates given fields of an existing supportingDocument, field will ignore if it is null
     *
     * @param id the id of the supportingDocument to save.
     * @param supportingDocument the supportingDocument to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated supportingDocument,
     * or with status {@code 400 (Bad Request)} if the supportingDocument is not valid,
     * or with status {@code 404 (Not Found)} if the supportingDocument is not found,
     * or with status {@code 500 (Internal Server Error)} if the supportingDocument couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/supporting-documents/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SupportingDocument> partialUpdateSupportingDocument(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SupportingDocument supportingDocument
    ) throws URISyntaxException {
        log.debug("REST request to partial update SupportingDocument partially : {}, {}", id, supportingDocument);
        if (supportingDocument.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, supportingDocument.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!supportingDocumentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SupportingDocument> result = supportingDocumentRepository
            .findById(supportingDocument.getId())
            .map(existingSupportingDocument -> {
                if (supportingDocument.getExternalId() != null) {
                    existingSupportingDocument.setExternalId(supportingDocument.getExternalId());
                }
                if (supportingDocument.getStatus() != null) {
                    existingSupportingDocument.setStatus(supportingDocument.getStatus());
                }
                if (supportingDocument.getSupportingDocumentType() != null) {
                    existingSupportingDocument.setSupportingDocumentType(supportingDocument.getSupportingDocumentType());
                }
                if (supportingDocument.getSupportingDocumentPurpose() != null) {
                    existingSupportingDocument.setSupportingDocumentPurpose(supportingDocument.getSupportingDocumentPurpose());
                }

                return existingSupportingDocument;
            })
            .map(supportingDocumentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, supportingDocument.getId().toString())
        );
    }

    /**
     * {@code GET  /supporting-documents} : get all the supportingDocuments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of supportingDocuments in body.
     */
    @GetMapping("/supporting-documents")
    public List<SupportingDocument> getAllSupportingDocuments() {
        log.debug("REST request to get all SupportingDocuments");
        return supportingDocumentRepository.findAll();
    }

    /**
     * {@code GET  /supporting-documents/:id} : get the "id" supportingDocument.
     *
     * @param id the id of the supportingDocument to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the supportingDocument, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/supporting-documents/{id}")
    public ResponseEntity<SupportingDocument> getSupportingDocument(@PathVariable Long id) {
        log.debug("REST request to get SupportingDocument : {}", id);
        Optional<SupportingDocument> supportingDocument = supportingDocumentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(supportingDocument);
    }

    /**
     * {@code DELETE  /supporting-documents/:id} : delete the "id" supportingDocument.
     *
     * @param id the id of the supportingDocument to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/supporting-documents/{id}")
    public ResponseEntity<Void> deleteSupportingDocument(@PathVariable Long id) {
        log.debug("REST request to delete SupportingDocument : {}", id);
        supportingDocumentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
