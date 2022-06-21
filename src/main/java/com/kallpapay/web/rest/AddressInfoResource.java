package com.kallpapay.web.rest;

import com.kallpapay.domain.AddressInfo;
import com.kallpapay.repository.AddressInfoRepository;
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
 * REST controller for managing {@link com.kallpapay.domain.AddressInfo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AddressInfoResource {

    private final Logger log = LoggerFactory.getLogger(AddressInfoResource.class);

    private static final String ENTITY_NAME = "addressInfo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AddressInfoRepository addressInfoRepository;

    public AddressInfoResource(AddressInfoRepository addressInfoRepository) {
        this.addressInfoRepository = addressInfoRepository;
    }

    /**
     * {@code POST  /address-infos} : Create a new addressInfo.
     *
     * @param addressInfo the addressInfo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new addressInfo, or with status {@code 400 (Bad Request)} if the addressInfo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/address-infos")
    public ResponseEntity<AddressInfo> createAddressInfo(@RequestBody AddressInfo addressInfo) throws URISyntaxException {
        log.debug("REST request to save AddressInfo : {}", addressInfo);
        if (addressInfo.getId() != null) {
            throw new BadRequestAlertException("A new addressInfo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AddressInfo result = addressInfoRepository.save(addressInfo);
        return ResponseEntity
            .created(new URI("/api/address-infos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /address-infos/:id} : Updates an existing addressInfo.
     *
     * @param id the id of the addressInfo to save.
     * @param addressInfo the addressInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated addressInfo,
     * or with status {@code 400 (Bad Request)} if the addressInfo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the addressInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/address-infos/{id}")
    public ResponseEntity<AddressInfo> updateAddressInfo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AddressInfo addressInfo
    ) throws URISyntaxException {
        log.debug("REST request to update AddressInfo : {}, {}", id, addressInfo);
        if (addressInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, addressInfo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!addressInfoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AddressInfo result = addressInfoRepository.save(addressInfo);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, addressInfo.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /address-infos/:id} : Partial updates given fields of an existing addressInfo, field will ignore if it is null
     *
     * @param id the id of the addressInfo to save.
     * @param addressInfo the addressInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated addressInfo,
     * or with status {@code 400 (Bad Request)} if the addressInfo is not valid,
     * or with status {@code 404 (Not Found)} if the addressInfo is not found,
     * or with status {@code 500 (Internal Server Error)} if the addressInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/address-infos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AddressInfo> partialUpdateAddressInfo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AddressInfo addressInfo
    ) throws URISyntaxException {
        log.debug("REST request to partial update AddressInfo partially : {}, {}", id, addressInfo);
        if (addressInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, addressInfo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!addressInfoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AddressInfo> result = addressInfoRepository
            .findById(addressInfo.getId())
            .map(existingAddressInfo -> {
                if (addressInfo.getName() != null) {
                    existingAddressInfo.setName(addressInfo.getName());
                }

                return existingAddressInfo;
            })
            .map(addressInfoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, addressInfo.getId().toString())
        );
    }

    /**
     * {@code GET  /address-infos} : get all the addressInfos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of addressInfos in body.
     */
    @GetMapping("/address-infos")
    public List<AddressInfo> getAllAddressInfos() {
        log.debug("REST request to get all AddressInfos");
        return addressInfoRepository.findAll();
    }

    /**
     * {@code GET  /address-infos/:id} : get the "id" addressInfo.
     *
     * @param id the id of the addressInfo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the addressInfo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/address-infos/{id}")
    public ResponseEntity<AddressInfo> getAddressInfo(@PathVariable Long id) {
        log.debug("REST request to get AddressInfo : {}", id);
        Optional<AddressInfo> addressInfo = addressInfoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(addressInfo);
    }

    /**
     * {@code DELETE  /address-infos/:id} : delete the "id" addressInfo.
     *
     * @param id the id of the addressInfo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/address-infos/{id}")
    public ResponseEntity<Void> deleteAddressInfo(@PathVariable Long id) {
        log.debug("REST request to delete AddressInfo : {}", id);
        addressInfoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
