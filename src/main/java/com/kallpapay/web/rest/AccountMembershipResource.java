package com.kallpapay.web.rest;

import com.kallpapay.domain.AccountMembership;
import com.kallpapay.repository.AccountMembershipRepository;
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
 * REST controller for managing {@link com.kallpapay.domain.AccountMembership}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AccountMembershipResource {

    private final Logger log = LoggerFactory.getLogger(AccountMembershipResource.class);

    private static final String ENTITY_NAME = "accountMembership";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AccountMembershipRepository accountMembershipRepository;

    public AccountMembershipResource(AccountMembershipRepository accountMembershipRepository) {
        this.accountMembershipRepository = accountMembershipRepository;
    }

    /**
     * {@code POST  /account-memberships} : Create a new accountMembership.
     *
     * @param accountMembership the accountMembership to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new accountMembership, or with status {@code 400 (Bad Request)} if the accountMembership has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/account-memberships")
    public ResponseEntity<AccountMembership> createAccountMembership(@RequestBody AccountMembership accountMembership)
        throws URISyntaxException {
        log.debug("REST request to save AccountMembership : {}", accountMembership);
        if (accountMembership.getId() != null) {
            throw new BadRequestAlertException("A new accountMembership cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AccountMembership result = accountMembershipRepository.save(accountMembership);
        return ResponseEntity
            .created(new URI("/api/account-memberships/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /account-memberships/:id} : Updates an existing accountMembership.
     *
     * @param id the id of the accountMembership to save.
     * @param accountMembership the accountMembership to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accountMembership,
     * or with status {@code 400 (Bad Request)} if the accountMembership is not valid,
     * or with status {@code 500 (Internal Server Error)} if the accountMembership couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/account-memberships/{id}")
    public ResponseEntity<AccountMembership> updateAccountMembership(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AccountMembership accountMembership
    ) throws URISyntaxException {
        log.debug("REST request to update AccountMembership : {}, {}", id, accountMembership);
        if (accountMembership.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accountMembership.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accountMembershipRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AccountMembership result = accountMembershipRepository.save(accountMembership);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accountMembership.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /account-memberships/:id} : Partial updates given fields of an existing accountMembership, field will ignore if it is null
     *
     * @param id the id of the accountMembership to save.
     * @param accountMembership the accountMembership to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accountMembership,
     * or with status {@code 400 (Bad Request)} if the accountMembership is not valid,
     * or with status {@code 404 (Not Found)} if the accountMembership is not found,
     * or with status {@code 500 (Internal Server Error)} if the accountMembership couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/account-memberships/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AccountMembership> partialUpdateAccountMembership(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AccountMembership accountMembership
    ) throws URISyntaxException {
        log.debug("REST request to partial update AccountMembership partially : {}, {}", id, accountMembership);
        if (accountMembership.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accountMembership.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accountMembershipRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AccountMembership> result = accountMembershipRepository
            .findById(accountMembership.getId())
            .map(existingAccountMembership -> {
                if (accountMembership.getExternalId() != null) {
                    existingAccountMembership.setExternalId(accountMembership.getExternalId());
                }
                if (accountMembership.getEmail() != null) {
                    existingAccountMembership.setEmail(accountMembership.getEmail());
                }
                if (accountMembership.getStatus() != null) {
                    existingAccountMembership.setStatus(accountMembership.getStatus());
                }

                return existingAccountMembership;
            })
            .map(accountMembershipRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accountMembership.getId().toString())
        );
    }

    /**
     * {@code GET  /account-memberships} : get all the accountMemberships.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of accountMemberships in body.
     */
    @GetMapping("/account-memberships")
    public List<AccountMembership> getAllAccountMemberships() {
        log.debug("REST request to get all AccountMemberships");
        return accountMembershipRepository.findAll();
    }

    /**
     * {@code GET  /account-memberships/:id} : get the "id" accountMembership.
     *
     * @param id the id of the accountMembership to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the accountMembership, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/account-memberships/{id}")
    public ResponseEntity<AccountMembership> getAccountMembership(@PathVariable Long id) {
        log.debug("REST request to get AccountMembership : {}", id);
        Optional<AccountMembership> accountMembership = accountMembershipRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(accountMembership);
    }

    /**
     * {@code DELETE  /account-memberships/:id} : delete the "id" accountMembership.
     *
     * @param id the id of the accountMembership to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/account-memberships/{id}")
    public ResponseEntity<Void> deleteAccountMembership(@PathVariable Long id) {
        log.debug("REST request to delete AccountMembership : {}", id);
        accountMembershipRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
