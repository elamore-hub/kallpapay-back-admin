package com.kallpapay.web.rest;

import com.kallpapay.domain.Onboarding;
import com.kallpapay.repository.OnboardingRepository;
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
 * REST controller for managing {@link com.kallpapay.domain.Onboarding}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OnboardingResource {

    private final Logger log = LoggerFactory.getLogger(OnboardingResource.class);

    private static final String ENTITY_NAME = "onboarding";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OnboardingRepository onboardingRepository;

    public OnboardingResource(OnboardingRepository onboardingRepository) {
        this.onboardingRepository = onboardingRepository;
    }

    /**
     * {@code POST  /onboardings} : Create a new onboarding.
     *
     * @param onboarding the onboarding to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new onboarding, or with status {@code 400 (Bad Request)} if the onboarding has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/onboardings")
    public ResponseEntity<Onboarding> createOnboarding(@RequestBody Onboarding onboarding) throws URISyntaxException {
        log.debug("REST request to save Onboarding : {}", onboarding);
        if (onboarding.getId() != null) {
            throw new BadRequestAlertException("A new onboarding cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Onboarding result = onboardingRepository.save(onboarding);
        return ResponseEntity
            .created(new URI("/api/onboardings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /onboardings/:id} : Updates an existing onboarding.
     *
     * @param id the id of the onboarding to save.
     * @param onboarding the onboarding to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated onboarding,
     * or with status {@code 400 (Bad Request)} if the onboarding is not valid,
     * or with status {@code 500 (Internal Server Error)} if the onboarding couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/onboardings/{id}")
    public ResponseEntity<Onboarding> updateOnboarding(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Onboarding onboarding
    ) throws URISyntaxException {
        log.debug("REST request to update Onboarding : {}, {}", id, onboarding);
        if (onboarding.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, onboarding.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!onboardingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Onboarding result = onboardingRepository.save(onboarding);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, onboarding.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /onboardings/:id} : Partial updates given fields of an existing onboarding, field will ignore if it is null
     *
     * @param id the id of the onboarding to save.
     * @param onboarding the onboarding to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated onboarding,
     * or with status {@code 400 (Bad Request)} if the onboarding is not valid,
     * or with status {@code 404 (Not Found)} if the onboarding is not found,
     * or with status {@code 500 (Internal Server Error)} if the onboarding couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/onboardings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Onboarding> partialUpdateOnboarding(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Onboarding onboarding
    ) throws URISyntaxException {
        log.debug("REST request to partial update Onboarding partially : {}, {}", id, onboarding);
        if (onboarding.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, onboarding.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!onboardingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Onboarding> result = onboardingRepository
            .findById(onboarding.getId())
            .map(existingOnboarding -> {
                if (onboarding.getExternalId() != null) {
                    existingOnboarding.setExternalId(onboarding.getExternalId());
                }
                if (onboarding.getAccountName() != null) {
                    existingOnboarding.setAccountName(onboarding.getAccountName());
                }
                if (onboarding.getEmail() != null) {
                    existingOnboarding.setEmail(onboarding.getEmail());
                }
                if (onboarding.getLanguage() != null) {
                    existingOnboarding.setLanguage(onboarding.getLanguage());
                }
                if (onboarding.getAccountHolderType() != null) {
                    existingOnboarding.setAccountHolderType(onboarding.getAccountHolderType());
                }
                if (onboarding.getOnboardingUrl() != null) {
                    existingOnboarding.setOnboardingUrl(onboarding.getOnboardingUrl());
                }
                if (onboarding.getOnboardingState() != null) {
                    existingOnboarding.setOnboardingState(onboarding.getOnboardingState());
                }
                if (onboarding.getRedirectUrl() != null) {
                    existingOnboarding.setRedirectUrl(onboarding.getRedirectUrl());
                }
                if (onboarding.getStatus() != null) {
                    existingOnboarding.setStatus(onboarding.getStatus());
                }
                if (onboarding.getTcuUrl() != null) {
                    existingOnboarding.setTcuUrl(onboarding.getTcuUrl());
                }

                return existingOnboarding;
            })
            .map(onboardingRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, onboarding.getId().toString())
        );
    }

    /**
     * {@code GET  /onboardings} : get all the onboardings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of onboardings in body.
     */
    @GetMapping("/onboardings")
    public List<Onboarding> getAllOnboardings() {
        log.debug("REST request to get all Onboardings");
        return onboardingRepository.findAll();
    }

    /**
     * {@code GET  /onboardings/:id} : get the "id" onboarding.
     *
     * @param id the id of the onboarding to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the onboarding, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/onboardings/{id}")
    public ResponseEntity<Onboarding> getOnboarding(@PathVariable Long id) {
        log.debug("REST request to get Onboarding : {}", id);
        Optional<Onboarding> onboarding = onboardingRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(onboarding);
    }

    /**
     * {@code DELETE  /onboardings/:id} : delete the "id" onboarding.
     *
     * @param id the id of the onboarding to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/onboardings/{id}")
    public ResponseEntity<Void> deleteOnboarding(@PathVariable Long id) {
        log.debug("REST request to delete Onboarding : {}", id);
        onboardingRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
