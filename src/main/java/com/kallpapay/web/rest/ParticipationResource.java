package com.kallpapay.web.rest;

import com.kallpapay.domain.Participation;
import com.kallpapay.repository.ParticipationRepository;
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
 * REST controller for managing {@link com.kallpapay.domain.Participation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ParticipationResource {

    private final Logger log = LoggerFactory.getLogger(ParticipationResource.class);

    private static final String ENTITY_NAME = "participation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ParticipationRepository participationRepository;

    public ParticipationResource(ParticipationRepository participationRepository) {
        this.participationRepository = participationRepository;
    }

    /**
     * {@code POST  /participations} : Create a new participation.
     *
     * @param participation the participation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new participation, or with status {@code 400 (Bad Request)} if the participation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/participations")
    public ResponseEntity<Participation> createParticipation(@RequestBody Participation participation) throws URISyntaxException {
        log.debug("REST request to save Participation : {}", participation);
        if (participation.getId() != null) {
            throw new BadRequestAlertException("A new participation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Participation result = participationRepository.save(participation);
        return ResponseEntity
            .created(new URI("/api/participations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /participations/:id} : Updates an existing participation.
     *
     * @param id the id of the participation to save.
     * @param participation the participation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated participation,
     * or with status {@code 400 (Bad Request)} if the participation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the participation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/participations/{id}")
    public ResponseEntity<Participation> updateParticipation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Participation participation
    ) throws URISyntaxException {
        log.debug("REST request to update Participation : {}, {}", id, participation);
        if (participation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, participation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!participationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Participation result = participationRepository.save(participation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, participation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /participations/:id} : Partial updates given fields of an existing participation, field will ignore if it is null
     *
     * @param id the id of the participation to save.
     * @param participation the participation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated participation,
     * or with status {@code 400 (Bad Request)} if the participation is not valid,
     * or with status {@code 404 (Not Found)} if the participation is not found,
     * or with status {@code 500 (Internal Server Error)} if the participation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/participations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Participation> partialUpdateParticipation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Participation participation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Participation partially : {}, {}", id, participation);
        if (participation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, participation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!participationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Participation> result = participationRepository
            .findById(participation.getId())
            .map(existingParticipation -> {
                if (participation.getCreationDate() != null) {
                    existingParticipation.setCreationDate(participation.getCreationDate());
                }

                return existingParticipation;
            })
            .map(participationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, participation.getId().toString())
        );
    }

    /**
     * {@code GET  /participations} : get all the participations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of participations in body.
     */
    @GetMapping("/participations")
    public List<Participation> getAllParticipations() {
        log.debug("REST request to get all Participations");
        return participationRepository.findAll();
    }

    /**
     * {@code GET  /participations/:id} : get the "id" participation.
     *
     * @param id the id of the participation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the participation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/participations/{id}")
    public ResponseEntity<Participation> getParticipation(@PathVariable Long id) {
        log.debug("REST request to get Participation : {}", id);
        Optional<Participation> participation = participationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(participation);
    }

    /**
     * {@code DELETE  /participations/:id} : delete the "id" participation.
     *
     * @param id the id of the participation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/participations/{id}")
    public ResponseEntity<Void> deleteParticipation(@PathVariable Long id) {
        log.debug("REST request to delete Participation : {}", id);
        participationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
