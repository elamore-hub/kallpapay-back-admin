package com.kallpapay.web.rest;

import com.kallpapay.domain.Cause;
import com.kallpapay.repository.CauseRepository;
import com.kallpapay.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.kallpapay.domain.Cause}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CauseResource {

    private final Logger log = LoggerFactory.getLogger(CauseResource.class);

    private static final String ENTITY_NAME = "cause";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CauseRepository causeRepository;

    public CauseResource(CauseRepository causeRepository) {
        this.causeRepository = causeRepository;
    }

    /**
     * {@code POST  /causes} : Create a new cause.
     *
     * @param cause the cause to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cause, or with status {@code 400 (Bad Request)} if the cause has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/causes")
    public ResponseEntity<Cause> createCause(@RequestBody Cause cause) throws URISyntaxException {
        log.debug("REST request to save Cause : {}", cause);
        if (cause.getId() != null) {
            throw new BadRequestAlertException("A new cause cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Cause result = causeRepository.save(cause);
        return ResponseEntity
            .created(new URI("/api/causes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /causes/:id} : Updates an existing cause.
     *
     * @param id the id of the cause to save.
     * @param cause the cause to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cause,
     * or with status {@code 400 (Bad Request)} if the cause is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cause couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/causes/{id}")
    public ResponseEntity<Cause> updateCause(@PathVariable(value = "id", required = false) final Long id, @RequestBody Cause cause)
        throws URISyntaxException {
        log.debug("REST request to update Cause : {}, {}", id, cause);
        if (cause.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cause.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!causeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Cause result = causeRepository.save(cause);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cause.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /causes/:id} : Partial updates given fields of an existing cause, field will ignore if it is null
     *
     * @param id the id of the cause to save.
     * @param cause the cause to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cause,
     * or with status {@code 400 (Bad Request)} if the cause is not valid,
     * or with status {@code 404 (Not Found)} if the cause is not found,
     * or with status {@code 500 (Internal Server Error)} if the cause couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/causes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Cause> partialUpdateCause(@PathVariable(value = "id", required = false) final Long id, @RequestBody Cause cause)
        throws URISyntaxException {
        log.debug("REST request to partial update Cause partially : {}, {}", id, cause);
        if (cause.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cause.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!causeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Cause> result = causeRepository
            .findById(cause.getId())
            .map(existingCause -> {
                if (cause.getName() != null) {
                    existingCause.setName(cause.getName());
                }
                if (cause.getDescription() != null) {
                    existingCause.setDescription(cause.getDescription());
                }
                if (cause.getLogo() != null) {
                    existingCause.setLogo(cause.getLogo());
                }
                if (cause.getLogoContentType() != null) {
                    existingCause.setLogoContentType(cause.getLogoContentType());
                }

                return existingCause;
            })
            .map(causeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cause.getId().toString())
        );
    }

    /**
     * {@code GET  /causes} : get all the causes.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of causes in body.
     */
    @GetMapping("/causes")
    public List<Cause> getAllCauses(@RequestParam(required = false) String filter) {
        if ("mycause-is-null".equals(filter)) {
            log.debug("REST request to get all Causes where myCause is null");
            return StreamSupport
                .stream(causeRepository.findAll().spliterator(), false)
                .filter(cause -> cause.getMyCause() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Causes");
        return causeRepository.findAll();
    }

    /**
     * {@code GET  /causes/:id} : get the "id" cause.
     *
     * @param id the id of the cause to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cause, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/causes/{id}")
    public ResponseEntity<Cause> getCause(@PathVariable Long id) {
        log.debug("REST request to get Cause : {}", id);
        Optional<Cause> cause = causeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(cause);
    }

    /**
     * {@code DELETE  /causes/:id} : delete the "id" cause.
     *
     * @param id the id of the cause to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/causes/{id}")
    public ResponseEntity<Void> deleteCause(@PathVariable Long id) {
        log.debug("REST request to delete Cause : {}", id);
        causeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
