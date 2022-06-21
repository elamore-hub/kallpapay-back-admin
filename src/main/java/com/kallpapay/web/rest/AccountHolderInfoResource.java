package com.kallpapay.web.rest;

import com.kallpapay.domain.AccountHolderInfo;
import com.kallpapay.repository.AccountHolderInfoRepository;
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
 * REST controller for managing {@link com.kallpapay.domain.AccountHolderInfo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AccountHolderInfoResource {

    private final Logger log = LoggerFactory.getLogger(AccountHolderInfoResource.class);

    private static final String ENTITY_NAME = "accountHolderInfo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AccountHolderInfoRepository accountHolderInfoRepository;

    public AccountHolderInfoResource(AccountHolderInfoRepository accountHolderInfoRepository) {
        this.accountHolderInfoRepository = accountHolderInfoRepository;
    }

    /**
     * {@code POST  /account-holder-infos} : Create a new accountHolderInfo.
     *
     * @param accountHolderInfo the accountHolderInfo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new accountHolderInfo, or with status {@code 400 (Bad Request)} if the accountHolderInfo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/account-holder-infos")
    public ResponseEntity<AccountHolderInfo> createAccountHolderInfo(@RequestBody AccountHolderInfo accountHolderInfo)
        throws URISyntaxException {
        log.debug("REST request to save AccountHolderInfo : {}", accountHolderInfo);
        if (accountHolderInfo.getId() != null) {
            throw new BadRequestAlertException("A new accountHolderInfo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AccountHolderInfo result = accountHolderInfoRepository.save(accountHolderInfo);
        return ResponseEntity
            .created(new URI("/api/account-holder-infos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /account-holder-infos/:id} : Updates an existing accountHolderInfo.
     *
     * @param id the id of the accountHolderInfo to save.
     * @param accountHolderInfo the accountHolderInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accountHolderInfo,
     * or with status {@code 400 (Bad Request)} if the accountHolderInfo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the accountHolderInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/account-holder-infos/{id}")
    public ResponseEntity<AccountHolderInfo> updateAccountHolderInfo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AccountHolderInfo accountHolderInfo
    ) throws URISyntaxException {
        log.debug("REST request to update AccountHolderInfo : {}, {}", id, accountHolderInfo);
        if (accountHolderInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accountHolderInfo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accountHolderInfoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AccountHolderInfo result = accountHolderInfoRepository.save(accountHolderInfo);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accountHolderInfo.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /account-holder-infos/:id} : Partial updates given fields of an existing accountHolderInfo, field will ignore if it is null
     *
     * @param id the id of the accountHolderInfo to save.
     * @param accountHolderInfo the accountHolderInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accountHolderInfo,
     * or with status {@code 400 (Bad Request)} if the accountHolderInfo is not valid,
     * or with status {@code 404 (Not Found)} if the accountHolderInfo is not found,
     * or with status {@code 500 (Internal Server Error)} if the accountHolderInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/account-holder-infos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AccountHolderInfo> partialUpdateAccountHolderInfo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AccountHolderInfo accountHolderInfo
    ) throws URISyntaxException {
        log.debug("REST request to partial update AccountHolderInfo partially : {}, {}", id, accountHolderInfo);
        if (accountHolderInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accountHolderInfo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accountHolderInfoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AccountHolderInfo> result = accountHolderInfoRepository
            .findById(accountHolderInfo.getId())
            .map(existingAccountHolderInfo -> {
                if (accountHolderInfo.getType() != null) {
                    existingAccountHolderInfo.setType(accountHolderInfo.getType());
                }
                if (accountHolderInfo.getName() != null) {
                    existingAccountHolderInfo.setName(accountHolderInfo.getName());
                }

                return existingAccountHolderInfo;
            })
            .map(accountHolderInfoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accountHolderInfo.getId().toString())
        );
    }

    /**
     * {@code GET  /account-holder-infos} : get all the accountHolderInfos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of accountHolderInfos in body.
     */
    @GetMapping("/account-holder-infos")
    public List<AccountHolderInfo> getAllAccountHolderInfos() {
        log.debug("REST request to get all AccountHolderInfos");
        return accountHolderInfoRepository.findAll();
    }

    /**
     * {@code GET  /account-holder-infos/:id} : get the "id" accountHolderInfo.
     *
     * @param id the id of the accountHolderInfo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the accountHolderInfo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/account-holder-infos/{id}")
    public ResponseEntity<AccountHolderInfo> getAccountHolderInfo(@PathVariable Long id) {
        log.debug("REST request to get AccountHolderInfo : {}", id);
        Optional<AccountHolderInfo> accountHolderInfo = accountHolderInfoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(accountHolderInfo);
    }

    /**
     * {@code DELETE  /account-holder-infos/:id} : delete the "id" accountHolderInfo.
     *
     * @param id the id of the accountHolderInfo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/account-holder-infos/{id}")
    public ResponseEntity<Void> deleteAccountHolderInfo(@PathVariable Long id) {
        log.debug("REST request to delete AccountHolderInfo : {}", id);
        accountHolderInfoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
