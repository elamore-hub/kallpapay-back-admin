package com.kallpapay.web.rest;

import com.kallpapay.domain.IBAN;
import com.kallpapay.repository.IBANRepository;
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
 * REST controller for managing {@link com.kallpapay.domain.IBAN}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class IBANResource {

    private final Logger log = LoggerFactory.getLogger(IBANResource.class);

    private static final String ENTITY_NAME = "iBAN";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IBANRepository iBANRepository;

    public IBANResource(IBANRepository iBANRepository) {
        this.iBANRepository = iBANRepository;
    }

    /**
     * {@code POST  /ibans} : Create a new iBAN.
     *
     * @param iBAN the iBAN to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new iBAN, or with status {@code 400 (Bad Request)} if the iBAN has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ibans")
    public ResponseEntity<IBAN> createIBAN(@RequestBody IBAN iBAN) throws URISyntaxException {
        log.debug("REST request to save IBAN : {}", iBAN);
        if (iBAN.getId() != null) {
            throw new BadRequestAlertException("A new iBAN cannot already have an ID", ENTITY_NAME, "idexists");
        }
        IBAN result = iBANRepository.save(iBAN);
        return ResponseEntity
            .created(new URI("/api/ibans/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ibans/:id} : Updates an existing iBAN.
     *
     * @param id the id of the iBAN to save.
     * @param iBAN the iBAN to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated iBAN,
     * or with status {@code 400 (Bad Request)} if the iBAN is not valid,
     * or with status {@code 500 (Internal Server Error)} if the iBAN couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ibans/{id}")
    public ResponseEntity<IBAN> updateIBAN(@PathVariable(value = "id", required = false) final Long id, @RequestBody IBAN iBAN)
        throws URISyntaxException {
        log.debug("REST request to update IBAN : {}, {}", id, iBAN);
        if (iBAN.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, iBAN.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!iBANRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        IBAN result = iBANRepository.save(iBAN);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, iBAN.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ibans/:id} : Partial updates given fields of an existing iBAN, field will ignore if it is null
     *
     * @param id the id of the iBAN to save.
     * @param iBAN the iBAN to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated iBAN,
     * or with status {@code 400 (Bad Request)} if the iBAN is not valid,
     * or with status {@code 404 (Not Found)} if the iBAN is not found,
     * or with status {@code 500 (Internal Server Error)} if the iBAN couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ibans/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<IBAN> partialUpdateIBAN(@PathVariable(value = "id", required = false) final Long id, @RequestBody IBAN iBAN)
        throws URISyntaxException {
        log.debug("REST request to partial update IBAN partially : {}, {}", id, iBAN);
        if (iBAN.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, iBAN.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!iBANRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<IBAN> result = iBANRepository
            .findById(iBAN.getId())
            .map(existingIBAN -> {
                if (iBAN.getName() != null) {
                    existingIBAN.setName(iBAN.getName());
                }
                if (iBAN.getIban() != null) {
                    existingIBAN.setIban(iBAN.getIban());
                }
                if (iBAN.getBic() != null) {
                    existingIBAN.setBic(iBAN.getBic());
                }
                if (iBAN.getAccountOwner() != null) {
                    existingIBAN.setAccountOwner(iBAN.getAccountOwner());
                }

                return existingIBAN;
            })
            .map(iBANRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, iBAN.getId().toString())
        );
    }

    /**
     * {@code GET  /ibans} : get all the iBANS.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of iBANS in body.
     */
    @GetMapping("/ibans")
    public List<IBAN> getAllIBANS() {
        log.debug("REST request to get all IBANS");
        return iBANRepository.findAll();
    }

    /**
     * {@code GET  /ibans/:id} : get the "id" iBAN.
     *
     * @param id the id of the iBAN to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the iBAN, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ibans/{id}")
    public ResponseEntity<IBAN> getIBAN(@PathVariable Long id) {
        log.debug("REST request to get IBAN : {}", id);
        Optional<IBAN> iBAN = iBANRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(iBAN);
    }

    /**
     * {@code DELETE  /ibans/:id} : delete the "id" iBAN.
     *
     * @param id the id of the iBAN to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ibans/{id}")
    public ResponseEntity<Void> deleteIBAN(@PathVariable Long id) {
        log.debug("REST request to delete IBAN : {}", id);
        iBANRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
