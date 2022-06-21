package com.kallpapay.web.rest;

import com.kallpapay.domain.AccountHolder;
import com.kallpapay.repository.AccountHolderRepository;
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
 * REST controller for managing {@link com.kallpapay.domain.AccountHolder}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AccountHolderResource {

    private final Logger log = LoggerFactory.getLogger(AccountHolderResource.class);

    private static final String ENTITY_NAME = "accountHolder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AccountHolderRepository accountHolderRepository;

    public AccountHolderResource(AccountHolderRepository accountHolderRepository) {
        this.accountHolderRepository = accountHolderRepository;
    }

    /**
     * {@code POST  /account-holders} : Create a new accountHolder.
     *
     * @param accountHolder the accountHolder to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new accountHolder, or with status {@code 400 (Bad Request)} if the accountHolder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/account-holders")
    public ResponseEntity<AccountHolder> createAccountHolder(@RequestBody AccountHolder accountHolder) throws URISyntaxException {
        log.debug("REST request to save AccountHolder : {}", accountHolder);
        if (accountHolder.getId() != null) {
            throw new BadRequestAlertException("A new accountHolder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AccountHolder result = accountHolderRepository.save(accountHolder);
        return ResponseEntity
            .created(new URI("/api/account-holders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /account-holders/:id} : Updates an existing accountHolder.
     *
     * @param id the id of the accountHolder to save.
     * @param accountHolder the accountHolder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accountHolder,
     * or with status {@code 400 (Bad Request)} if the accountHolder is not valid,
     * or with status {@code 500 (Internal Server Error)} if the accountHolder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/account-holders/{id}")
    public ResponseEntity<AccountHolder> updateAccountHolder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AccountHolder accountHolder
    ) throws URISyntaxException {
        log.debug("REST request to update AccountHolder : {}, {}", id, accountHolder);
        if (accountHolder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accountHolder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accountHolderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AccountHolder result = accountHolderRepository.save(accountHolder);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accountHolder.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /account-holders/:id} : Partial updates given fields of an existing accountHolder, field will ignore if it is null
     *
     * @param id the id of the accountHolder to save.
     * @param accountHolder the accountHolder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accountHolder,
     * or with status {@code 400 (Bad Request)} if the accountHolder is not valid,
     * or with status {@code 404 (Not Found)} if the accountHolder is not found,
     * or with status {@code 500 (Internal Server Error)} if the accountHolder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/account-holders/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AccountHolder> partialUpdateAccountHolder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AccountHolder accountHolder
    ) throws URISyntaxException {
        log.debug("REST request to partial update AccountHolder partially : {}, {}", id, accountHolder);
        if (accountHolder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accountHolder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accountHolderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AccountHolder> result = accountHolderRepository
            .findById(accountHolder.getId())
            .map(existingAccountHolder -> {
                if (accountHolder.getExternalId() != null) {
                    existingAccountHolder.setExternalId(accountHolder.getExternalId());
                }
                if (accountHolder.getVerificationStatus() != null) {
                    existingAccountHolder.setVerificationStatus(accountHolder.getVerificationStatus());
                }
                if (accountHolder.getStatusInfo() != null) {
                    existingAccountHolder.setStatusInfo(accountHolder.getStatusInfo());
                }

                return existingAccountHolder;
            })
            .map(accountHolderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accountHolder.getId().toString())
        );
    }

    /**
     * {@code GET  /account-holders} : get all the accountHolders.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of accountHolders in body.
     */
    @GetMapping("/account-holders")
    public List<AccountHolder> getAllAccountHolders(@RequestParam(required = false) String filter) {
        if ("onboarding-is-null".equals(filter)) {
            log.debug("REST request to get all AccountHolders where onboarding is null");
            return StreamSupport
                .stream(accountHolderRepository.findAll().spliterator(), false)
                .filter(accountHolder -> accountHolder.getOnboarding() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all AccountHolders");
        return accountHolderRepository.findAll();
    }

    /**
     * {@code GET  /account-holders/:id} : get the "id" accountHolder.
     *
     * @param id the id of the accountHolder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the accountHolder, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/account-holders/{id}")
    public ResponseEntity<AccountHolder> getAccountHolder(@PathVariable Long id) {
        log.debug("REST request to get AccountHolder : {}", id);
        Optional<AccountHolder> accountHolder = accountHolderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(accountHolder);
    }

    /**
     * {@code DELETE  /account-holders/:id} : delete the "id" accountHolder.
     *
     * @param id the id of the accountHolder to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/account-holders/{id}")
    public ResponseEntity<Void> deleteAccountHolder(@PathVariable Long id) {
        log.debug("REST request to delete AccountHolder : {}", id);
        accountHolderRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
