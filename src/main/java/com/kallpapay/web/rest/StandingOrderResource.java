package com.kallpapay.web.rest;

import com.kallpapay.domain.StandingOrder;
import com.kallpapay.repository.StandingOrderRepository;
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
 * REST controller for managing {@link com.kallpapay.domain.StandingOrder}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StandingOrderResource {

    private final Logger log = LoggerFactory.getLogger(StandingOrderResource.class);

    private static final String ENTITY_NAME = "standingOrder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StandingOrderRepository standingOrderRepository;

    public StandingOrderResource(StandingOrderRepository standingOrderRepository) {
        this.standingOrderRepository = standingOrderRepository;
    }

    /**
     * {@code POST  /standing-orders} : Create a new standingOrder.
     *
     * @param standingOrder the standingOrder to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new standingOrder, or with status {@code 400 (Bad Request)} if the standingOrder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/standing-orders")
    public ResponseEntity<StandingOrder> createStandingOrder(@RequestBody StandingOrder standingOrder) throws URISyntaxException {
        log.debug("REST request to save StandingOrder : {}", standingOrder);
        if (standingOrder.getId() != null) {
            throw new BadRequestAlertException("A new standingOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StandingOrder result = standingOrderRepository.save(standingOrder);
        return ResponseEntity
            .created(new URI("/api/standing-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /standing-orders/:id} : Updates an existing standingOrder.
     *
     * @param id the id of the standingOrder to save.
     * @param standingOrder the standingOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated standingOrder,
     * or with status {@code 400 (Bad Request)} if the standingOrder is not valid,
     * or with status {@code 500 (Internal Server Error)} if the standingOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/standing-orders/{id}")
    public ResponseEntity<StandingOrder> updateStandingOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody StandingOrder standingOrder
    ) throws URISyntaxException {
        log.debug("REST request to update StandingOrder : {}, {}", id, standingOrder);
        if (standingOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, standingOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!standingOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        StandingOrder result = standingOrderRepository.save(standingOrder);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, standingOrder.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /standing-orders/:id} : Partial updates given fields of an existing standingOrder, field will ignore if it is null
     *
     * @param id the id of the standingOrder to save.
     * @param standingOrder the standingOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated standingOrder,
     * or with status {@code 400 (Bad Request)} if the standingOrder is not valid,
     * or with status {@code 404 (Not Found)} if the standingOrder is not found,
     * or with status {@code 500 (Internal Server Error)} if the standingOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/standing-orders/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StandingOrder> partialUpdateStandingOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody StandingOrder standingOrder
    ) throws URISyntaxException {
        log.debug("REST request to partial update StandingOrder partially : {}, {}", id, standingOrder);
        if (standingOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, standingOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!standingOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StandingOrder> result = standingOrderRepository
            .findById(standingOrder.getId())
            .map(existingStandingOrder -> {
                if (standingOrder.getExternalId() != null) {
                    existingStandingOrder.setExternalId(standingOrder.getExternalId());
                }
                if (standingOrder.getReference() != null) {
                    existingStandingOrder.setReference(standingOrder.getReference());
                }
                if (standingOrder.getLabel() != null) {
                    existingStandingOrder.setLabel(standingOrder.getLabel());
                }
                if (standingOrder.getStatus() != null) {
                    existingStandingOrder.setStatus(standingOrder.getStatus());
                }

                return existingStandingOrder;
            })
            .map(standingOrderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, standingOrder.getId().toString())
        );
    }

    /**
     * {@code GET  /standing-orders} : get all the standingOrders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of standingOrders in body.
     */
    @GetMapping("/standing-orders")
    public List<StandingOrder> getAllStandingOrders() {
        log.debug("REST request to get all StandingOrders");
        return standingOrderRepository.findAll();
    }

    /**
     * {@code GET  /standing-orders/:id} : get the "id" standingOrder.
     *
     * @param id the id of the standingOrder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the standingOrder, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/standing-orders/{id}")
    public ResponseEntity<StandingOrder> getStandingOrder(@PathVariable Long id) {
        log.debug("REST request to get StandingOrder : {}", id);
        Optional<StandingOrder> standingOrder = standingOrderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(standingOrder);
    }

    /**
     * {@code DELETE  /standing-orders/:id} : delete the "id" standingOrder.
     *
     * @param id the id of the standingOrder to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/standing-orders/{id}")
    public ResponseEntity<Void> deleteStandingOrder(@PathVariable Long id) {
        log.debug("REST request to delete StandingOrder : {}", id);
        standingOrderRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
