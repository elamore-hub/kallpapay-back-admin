package com.kallpapay.web.rest;

import com.kallpapay.domain.MyCause;
import com.kallpapay.repository.MyCauseRepository;
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
 * REST controller for managing {@link com.kallpapay.domain.MyCause}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MyCauseResource {

    private final Logger log = LoggerFactory.getLogger(MyCauseResource.class);

    private static final String ENTITY_NAME = "myCause";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MyCauseRepository myCauseRepository;

    public MyCauseResource(MyCauseRepository myCauseRepository) {
        this.myCauseRepository = myCauseRepository;
    }

    /**
     * {@code POST  /my-causes} : Create a new myCause.
     *
     * @param myCause the myCause to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new myCause, or with status {@code 400 (Bad Request)} if the myCause has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/my-causes")
    public ResponseEntity<MyCause> createMyCause(@RequestBody MyCause myCause) throws URISyntaxException {
        log.debug("REST request to save MyCause : {}", myCause);
        if (myCause.getId() != null) {
            throw new BadRequestAlertException("A new myCause cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MyCause result = myCauseRepository.save(myCause);
        return ResponseEntity
            .created(new URI("/api/my-causes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /my-causes/:id} : Updates an existing myCause.
     *
     * @param id the id of the myCause to save.
     * @param myCause the myCause to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated myCause,
     * or with status {@code 400 (Bad Request)} if the myCause is not valid,
     * or with status {@code 500 (Internal Server Error)} if the myCause couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/my-causes/{id}")
    public ResponseEntity<MyCause> updateMyCause(@PathVariable(value = "id", required = false) final Long id, @RequestBody MyCause myCause)
        throws URISyntaxException {
        log.debug("REST request to update MyCause : {}, {}", id, myCause);
        if (myCause.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, myCause.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!myCauseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MyCause result = myCauseRepository.save(myCause);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, myCause.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /my-causes/:id} : Partial updates given fields of an existing myCause, field will ignore if it is null
     *
     * @param id the id of the myCause to save.
     * @param myCause the myCause to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated myCause,
     * or with status {@code 400 (Bad Request)} if the myCause is not valid,
     * or with status {@code 404 (Not Found)} if the myCause is not found,
     * or with status {@code 500 (Internal Server Error)} if the myCause couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/my-causes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MyCause> partialUpdateMyCause(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MyCause myCause
    ) throws URISyntaxException {
        log.debug("REST request to partial update MyCause partially : {}, {}", id, myCause);
        if (myCause.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, myCause.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!myCauseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MyCause> result = myCauseRepository
            .findById(myCause.getId())
            .map(existingMyCause -> {
                if (myCause.getPercentage() != null) {
                    existingMyCause.setPercentage(myCause.getPercentage());
                }

                return existingMyCause;
            })
            .map(myCauseRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, myCause.getId().toString())
        );
    }

    /**
     * {@code GET  /my-causes} : get all the myCauses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of myCauses in body.
     */
    @GetMapping("/my-causes")
    public List<MyCause> getAllMyCauses() {
        log.debug("REST request to get all MyCauses");
        return myCauseRepository.findAll();
    }

    /**
     * {@code GET  /my-causes/:id} : get the "id" myCause.
     *
     * @param id the id of the myCause to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the myCause, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/my-causes/{id}")
    public ResponseEntity<MyCause> getMyCause(@PathVariable Long id) {
        log.debug("REST request to get MyCause : {}", id);
        Optional<MyCause> myCause = myCauseRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(myCause);
    }

    /**
     * {@code DELETE  /my-causes/:id} : delete the "id" myCause.
     *
     * @param id the id of the myCause to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/my-causes/{id}")
    public ResponseEntity<Void> deleteMyCause(@PathVariable Long id) {
        log.debug("REST request to delete MyCause : {}", id);
        myCauseRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
