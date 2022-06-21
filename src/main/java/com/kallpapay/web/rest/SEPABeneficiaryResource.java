package com.kallpapay.web.rest;

import com.kallpapay.domain.SEPABeneficiary;
import com.kallpapay.repository.SEPABeneficiaryRepository;
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
 * REST controller for managing {@link com.kallpapay.domain.SEPABeneficiary}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SEPABeneficiaryResource {

    private final Logger log = LoggerFactory.getLogger(SEPABeneficiaryResource.class);

    private static final String ENTITY_NAME = "sEPABeneficiary";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SEPABeneficiaryRepository sEPABeneficiaryRepository;

    public SEPABeneficiaryResource(SEPABeneficiaryRepository sEPABeneficiaryRepository) {
        this.sEPABeneficiaryRepository = sEPABeneficiaryRepository;
    }

    /**
     * {@code POST  /sepa-beneficiaries} : Create a new sEPABeneficiary.
     *
     * @param sEPABeneficiary the sEPABeneficiary to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sEPABeneficiary, or with status {@code 400 (Bad Request)} if the sEPABeneficiary has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sepa-beneficiaries")
    public ResponseEntity<SEPABeneficiary> createSEPABeneficiary(@RequestBody SEPABeneficiary sEPABeneficiary) throws URISyntaxException {
        log.debug("REST request to save SEPABeneficiary : {}", sEPABeneficiary);
        if (sEPABeneficiary.getId() != null) {
            throw new BadRequestAlertException("A new sEPABeneficiary cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SEPABeneficiary result = sEPABeneficiaryRepository.save(sEPABeneficiary);
        return ResponseEntity
            .created(new URI("/api/sepa-beneficiaries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sepa-beneficiaries/:id} : Updates an existing sEPABeneficiary.
     *
     * @param id the id of the sEPABeneficiary to save.
     * @param sEPABeneficiary the sEPABeneficiary to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sEPABeneficiary,
     * or with status {@code 400 (Bad Request)} if the sEPABeneficiary is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sEPABeneficiary couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sepa-beneficiaries/{id}")
    public ResponseEntity<SEPABeneficiary> updateSEPABeneficiary(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SEPABeneficiary sEPABeneficiary
    ) throws URISyntaxException {
        log.debug("REST request to update SEPABeneficiary : {}, {}", id, sEPABeneficiary);
        if (sEPABeneficiary.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sEPABeneficiary.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sEPABeneficiaryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SEPABeneficiary result = sEPABeneficiaryRepository.save(sEPABeneficiary);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sEPABeneficiary.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sepa-beneficiaries/:id} : Partial updates given fields of an existing sEPABeneficiary, field will ignore if it is null
     *
     * @param id the id of the sEPABeneficiary to save.
     * @param sEPABeneficiary the sEPABeneficiary to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sEPABeneficiary,
     * or with status {@code 400 (Bad Request)} if the sEPABeneficiary is not valid,
     * or with status {@code 404 (Not Found)} if the sEPABeneficiary is not found,
     * or with status {@code 500 (Internal Server Error)} if the sEPABeneficiary couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sepa-beneficiaries/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SEPABeneficiary> partialUpdateSEPABeneficiary(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SEPABeneficiary sEPABeneficiary
    ) throws URISyntaxException {
        log.debug("REST request to partial update SEPABeneficiary partially : {}, {}", id, sEPABeneficiary);
        if (sEPABeneficiary.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sEPABeneficiary.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sEPABeneficiaryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SEPABeneficiary> result = sEPABeneficiaryRepository
            .findById(sEPABeneficiary.getId())
            .map(existingSEPABeneficiary -> {
                if (sEPABeneficiary.getExternalId() != null) {
                    existingSEPABeneficiary.setExternalId(sEPABeneficiary.getExternalId());
                }
                if (sEPABeneficiary.getName() != null) {
                    existingSEPABeneficiary.setName(sEPABeneficiary.getName());
                }
                if (sEPABeneficiary.getIsMyOwnIban() != null) {
                    existingSEPABeneficiary.setIsMyOwnIban(sEPABeneficiary.getIsMyOwnIban());
                }
                if (sEPABeneficiary.getMaskedIBAN() != null) {
                    existingSEPABeneficiary.setMaskedIBAN(sEPABeneficiary.getMaskedIBAN());
                }

                return existingSEPABeneficiary;
            })
            .map(sEPABeneficiaryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sEPABeneficiary.getId().toString())
        );
    }

    /**
     * {@code GET  /sepa-beneficiaries} : get all the sEPABeneficiaries.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sEPABeneficiaries in body.
     */
    @GetMapping("/sepa-beneficiaries")
    public List<SEPABeneficiary> getAllSEPABeneficiaries() {
        log.debug("REST request to get all SEPABeneficiaries");
        return sEPABeneficiaryRepository.findAll();
    }

    /**
     * {@code GET  /sepa-beneficiaries/:id} : get the "id" sEPABeneficiary.
     *
     * @param id the id of the sEPABeneficiary to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sEPABeneficiary, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sepa-beneficiaries/{id}")
    public ResponseEntity<SEPABeneficiary> getSEPABeneficiary(@PathVariable Long id) {
        log.debug("REST request to get SEPABeneficiary : {}", id);
        Optional<SEPABeneficiary> sEPABeneficiary = sEPABeneficiaryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sEPABeneficiary);
    }

    /**
     * {@code DELETE  /sepa-beneficiaries/:id} : delete the "id" sEPABeneficiary.
     *
     * @param id the id of the sEPABeneficiary to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sepa-beneficiaries/{id}")
    public ResponseEntity<Void> deleteSEPABeneficiary(@PathVariable Long id) {
        log.debug("REST request to delete SEPABeneficiary : {}", id);
        sEPABeneficiaryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
