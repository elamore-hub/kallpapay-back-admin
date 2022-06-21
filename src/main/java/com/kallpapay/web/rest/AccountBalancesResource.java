package com.kallpapay.web.rest;

import com.kallpapay.domain.AccountBalances;
import com.kallpapay.repository.AccountBalancesRepository;
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
 * REST controller for managing {@link com.kallpapay.domain.AccountBalances}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AccountBalancesResource {

    private final Logger log = LoggerFactory.getLogger(AccountBalancesResource.class);

    private static final String ENTITY_NAME = "accountBalances";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AccountBalancesRepository accountBalancesRepository;

    public AccountBalancesResource(AccountBalancesRepository accountBalancesRepository) {
        this.accountBalancesRepository = accountBalancesRepository;
    }

    /**
     * {@code POST  /account-balances} : Create a new accountBalances.
     *
     * @param accountBalances the accountBalances to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new accountBalances, or with status {@code 400 (Bad Request)} if the accountBalances has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/account-balances")
    public ResponseEntity<AccountBalances> createAccountBalances(@RequestBody AccountBalances accountBalances) throws URISyntaxException {
        log.debug("REST request to save AccountBalances : {}", accountBalances);
        if (accountBalances.getId() != null) {
            throw new BadRequestAlertException("A new accountBalances cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AccountBalances result = accountBalancesRepository.save(accountBalances);
        return ResponseEntity
            .created(new URI("/api/account-balances/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /account-balances/:id} : Updates an existing accountBalances.
     *
     * @param id the id of the accountBalances to save.
     * @param accountBalances the accountBalances to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accountBalances,
     * or with status {@code 400 (Bad Request)} if the accountBalances is not valid,
     * or with status {@code 500 (Internal Server Error)} if the accountBalances couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/account-balances/{id}")
    public ResponseEntity<AccountBalances> updateAccountBalances(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AccountBalances accountBalances
    ) throws URISyntaxException {
        log.debug("REST request to update AccountBalances : {}, {}", id, accountBalances);
        if (accountBalances.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accountBalances.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accountBalancesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AccountBalances result = accountBalancesRepository.save(accountBalances);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accountBalances.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /account-balances/:id} : Partial updates given fields of an existing accountBalances, field will ignore if it is null
     *
     * @param id the id of the accountBalances to save.
     * @param accountBalances the accountBalances to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accountBalances,
     * or with status {@code 400 (Bad Request)} if the accountBalances is not valid,
     * or with status {@code 404 (Not Found)} if the accountBalances is not found,
     * or with status {@code 500 (Internal Server Error)} if the accountBalances couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/account-balances/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AccountBalances> partialUpdateAccountBalances(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AccountBalances accountBalances
    ) throws URISyntaxException {
        log.debug("REST request to partial update AccountBalances partially : {}, {}", id, accountBalances);
        if (accountBalances.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accountBalances.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accountBalancesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AccountBalances> result = accountBalancesRepository
            .findById(accountBalances.getId())
            .map(existingAccountBalances -> {
                return existingAccountBalances;
            })
            .map(accountBalancesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accountBalances.getId().toString())
        );
    }

    /**
     * {@code GET  /account-balances} : get all the accountBalances.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of accountBalances in body.
     */
    @GetMapping("/account-balances")
    public List<AccountBalances> getAllAccountBalances() {
        log.debug("REST request to get all AccountBalances");
        return accountBalancesRepository.findAll();
    }

    /**
     * {@code GET  /account-balances/:id} : get the "id" accountBalances.
     *
     * @param id the id of the accountBalances to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the accountBalances, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/account-balances/{id}")
    public ResponseEntity<AccountBalances> getAccountBalances(@PathVariable Long id) {
        log.debug("REST request to get AccountBalances : {}", id);
        Optional<AccountBalances> accountBalances = accountBalancesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(accountBalances);
    }

    /**
     * {@code DELETE  /account-balances/:id} : delete the "id" accountBalances.
     *
     * @param id the id of the accountBalances to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/account-balances/{id}")
    public ResponseEntity<Void> deleteAccountBalances(@PathVariable Long id) {
        log.debug("REST request to delete AccountBalances : {}", id);
        accountBalancesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
