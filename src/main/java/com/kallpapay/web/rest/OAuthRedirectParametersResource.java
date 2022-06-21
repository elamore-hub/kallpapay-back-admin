package com.kallpapay.web.rest;

import com.kallpapay.domain.OAuthRedirectParameters;
import com.kallpapay.repository.OAuthRedirectParametersRepository;
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
 * REST controller for managing {@link com.kallpapay.domain.OAuthRedirectParameters}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OAuthRedirectParametersResource {

    private final Logger log = LoggerFactory.getLogger(OAuthRedirectParametersResource.class);

    private static final String ENTITY_NAME = "oAuthRedirectParameters";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OAuthRedirectParametersRepository oAuthRedirectParametersRepository;

    public OAuthRedirectParametersResource(OAuthRedirectParametersRepository oAuthRedirectParametersRepository) {
        this.oAuthRedirectParametersRepository = oAuthRedirectParametersRepository;
    }

    /**
     * {@code POST  /o-auth-redirect-parameters} : Create a new oAuthRedirectParameters.
     *
     * @param oAuthRedirectParameters the oAuthRedirectParameters to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new oAuthRedirectParameters, or with status {@code 400 (Bad Request)} if the oAuthRedirectParameters has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/o-auth-redirect-parameters")
    public ResponseEntity<OAuthRedirectParameters> createOAuthRedirectParameters(
        @RequestBody OAuthRedirectParameters oAuthRedirectParameters
    ) throws URISyntaxException {
        log.debug("REST request to save OAuthRedirectParameters : {}", oAuthRedirectParameters);
        if (oAuthRedirectParameters.getId() != null) {
            throw new BadRequestAlertException("A new oAuthRedirectParameters cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OAuthRedirectParameters result = oAuthRedirectParametersRepository.save(oAuthRedirectParameters);
        return ResponseEntity
            .created(new URI("/api/o-auth-redirect-parameters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /o-auth-redirect-parameters/:id} : Updates an existing oAuthRedirectParameters.
     *
     * @param id the id of the oAuthRedirectParameters to save.
     * @param oAuthRedirectParameters the oAuthRedirectParameters to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated oAuthRedirectParameters,
     * or with status {@code 400 (Bad Request)} if the oAuthRedirectParameters is not valid,
     * or with status {@code 500 (Internal Server Error)} if the oAuthRedirectParameters couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/o-auth-redirect-parameters/{id}")
    public ResponseEntity<OAuthRedirectParameters> updateOAuthRedirectParameters(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OAuthRedirectParameters oAuthRedirectParameters
    ) throws URISyntaxException {
        log.debug("REST request to update OAuthRedirectParameters : {}, {}", id, oAuthRedirectParameters);
        if (oAuthRedirectParameters.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, oAuthRedirectParameters.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!oAuthRedirectParametersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OAuthRedirectParameters result = oAuthRedirectParametersRepository.save(oAuthRedirectParameters);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, oAuthRedirectParameters.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /o-auth-redirect-parameters/:id} : Partial updates given fields of an existing oAuthRedirectParameters, field will ignore if it is null
     *
     * @param id the id of the oAuthRedirectParameters to save.
     * @param oAuthRedirectParameters the oAuthRedirectParameters to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated oAuthRedirectParameters,
     * or with status {@code 400 (Bad Request)} if the oAuthRedirectParameters is not valid,
     * or with status {@code 404 (Not Found)} if the oAuthRedirectParameters is not found,
     * or with status {@code 500 (Internal Server Error)} if the oAuthRedirectParameters couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/o-auth-redirect-parameters/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OAuthRedirectParameters> partialUpdateOAuthRedirectParameters(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OAuthRedirectParameters oAuthRedirectParameters
    ) throws URISyntaxException {
        log.debug("REST request to partial update OAuthRedirectParameters partially : {}, {}", id, oAuthRedirectParameters);
        if (oAuthRedirectParameters.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, oAuthRedirectParameters.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!oAuthRedirectParametersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OAuthRedirectParameters> result = oAuthRedirectParametersRepository
            .findById(oAuthRedirectParameters.getId())
            .map(existingOAuthRedirectParameters -> {
                if (oAuthRedirectParameters.getState() != null) {
                    existingOAuthRedirectParameters.setState(oAuthRedirectParameters.getState());
                }
                if (oAuthRedirectParameters.getRedirectUrl() != null) {
                    existingOAuthRedirectParameters.setRedirectUrl(oAuthRedirectParameters.getRedirectUrl());
                }

                return existingOAuthRedirectParameters;
            })
            .map(oAuthRedirectParametersRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, oAuthRedirectParameters.getId().toString())
        );
    }

    /**
     * {@code GET  /o-auth-redirect-parameters} : get all the oAuthRedirectParameters.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of oAuthRedirectParameters in body.
     */
    @GetMapping("/o-auth-redirect-parameters")
    public List<OAuthRedirectParameters> getAllOAuthRedirectParameters() {
        log.debug("REST request to get all OAuthRedirectParameters");
        return oAuthRedirectParametersRepository.findAll();
    }

    /**
     * {@code GET  /o-auth-redirect-parameters/:id} : get the "id" oAuthRedirectParameters.
     *
     * @param id the id of the oAuthRedirectParameters to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the oAuthRedirectParameters, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/o-auth-redirect-parameters/{id}")
    public ResponseEntity<OAuthRedirectParameters> getOAuthRedirectParameters(@PathVariable Long id) {
        log.debug("REST request to get OAuthRedirectParameters : {}", id);
        Optional<OAuthRedirectParameters> oAuthRedirectParameters = oAuthRedirectParametersRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(oAuthRedirectParameters);
    }

    /**
     * {@code DELETE  /o-auth-redirect-parameters/:id} : delete the "id" oAuthRedirectParameters.
     *
     * @param id the id of the oAuthRedirectParameters to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/o-auth-redirect-parameters/{id}")
    public ResponseEntity<Void> deleteOAuthRedirectParameters(@PathVariable Long id) {
        log.debug("REST request to delete OAuthRedirectParameters : {}", id);
        oAuthRedirectParametersRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
