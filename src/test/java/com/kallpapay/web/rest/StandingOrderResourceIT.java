package com.kallpapay.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kallpapay.IntegrationTest;
import com.kallpapay.domain.StandingOrder;
import com.kallpapay.repository.StandingOrderRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link StandingOrderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StandingOrderResourceIT {

    private static final String DEFAULT_EXTERNAL_ID = "AAAAAAAAAA";
    private static final String UPDATED_EXTERNAL_ID = "BBBBBBBBBB";

    private static final String DEFAULT_REFERENCE = "AAAAAAAAAA";
    private static final String UPDATED_REFERENCE = "BBBBBBBBBB";

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/standing-orders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StandingOrderRepository standingOrderRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStandingOrderMockMvc;

    private StandingOrder standingOrder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StandingOrder createEntity(EntityManager em) {
        StandingOrder standingOrder = new StandingOrder()
            .externalId(DEFAULT_EXTERNAL_ID)
            .reference(DEFAULT_REFERENCE)
            .label(DEFAULT_LABEL)
            .status(DEFAULT_STATUS);
        return standingOrder;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StandingOrder createUpdatedEntity(EntityManager em) {
        StandingOrder standingOrder = new StandingOrder()
            .externalId(UPDATED_EXTERNAL_ID)
            .reference(UPDATED_REFERENCE)
            .label(UPDATED_LABEL)
            .status(UPDATED_STATUS);
        return standingOrder;
    }

    @BeforeEach
    public void initTest() {
        standingOrder = createEntity(em);
    }

    @Test
    @Transactional
    void createStandingOrder() throws Exception {
        int databaseSizeBeforeCreate = standingOrderRepository.findAll().size();
        // Create the StandingOrder
        restStandingOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(standingOrder)))
            .andExpect(status().isCreated());

        // Validate the StandingOrder in the database
        List<StandingOrder> standingOrderList = standingOrderRepository.findAll();
        assertThat(standingOrderList).hasSize(databaseSizeBeforeCreate + 1);
        StandingOrder testStandingOrder = standingOrderList.get(standingOrderList.size() - 1);
        assertThat(testStandingOrder.getExternalId()).isEqualTo(DEFAULT_EXTERNAL_ID);
        assertThat(testStandingOrder.getReference()).isEqualTo(DEFAULT_REFERENCE);
        assertThat(testStandingOrder.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testStandingOrder.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createStandingOrderWithExistingId() throws Exception {
        // Create the StandingOrder with an existing ID
        standingOrder.setId(1L);

        int databaseSizeBeforeCreate = standingOrderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStandingOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(standingOrder)))
            .andExpect(status().isBadRequest());

        // Validate the StandingOrder in the database
        List<StandingOrder> standingOrderList = standingOrderRepository.findAll();
        assertThat(standingOrderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllStandingOrders() throws Exception {
        // Initialize the database
        standingOrderRepository.saveAndFlush(standingOrder);

        // Get all the standingOrderList
        restStandingOrderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(standingOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].externalId").value(hasItem(DEFAULT_EXTERNAL_ID)))
            .andExpect(jsonPath("$.[*].reference").value(hasItem(DEFAULT_REFERENCE)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @Test
    @Transactional
    void getStandingOrder() throws Exception {
        // Initialize the database
        standingOrderRepository.saveAndFlush(standingOrder);

        // Get the standingOrder
        restStandingOrderMockMvc
            .perform(get(ENTITY_API_URL_ID, standingOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(standingOrder.getId().intValue()))
            .andExpect(jsonPath("$.externalId").value(DEFAULT_EXTERNAL_ID))
            .andExpect(jsonPath("$.reference").value(DEFAULT_REFERENCE))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingStandingOrder() throws Exception {
        // Get the standingOrder
        restStandingOrderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewStandingOrder() throws Exception {
        // Initialize the database
        standingOrderRepository.saveAndFlush(standingOrder);

        int databaseSizeBeforeUpdate = standingOrderRepository.findAll().size();

        // Update the standingOrder
        StandingOrder updatedStandingOrder = standingOrderRepository.findById(standingOrder.getId()).get();
        // Disconnect from session so that the updates on updatedStandingOrder are not directly saved in db
        em.detach(updatedStandingOrder);
        updatedStandingOrder.externalId(UPDATED_EXTERNAL_ID).reference(UPDATED_REFERENCE).label(UPDATED_LABEL).status(UPDATED_STATUS);

        restStandingOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStandingOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStandingOrder))
            )
            .andExpect(status().isOk());

        // Validate the StandingOrder in the database
        List<StandingOrder> standingOrderList = standingOrderRepository.findAll();
        assertThat(standingOrderList).hasSize(databaseSizeBeforeUpdate);
        StandingOrder testStandingOrder = standingOrderList.get(standingOrderList.size() - 1);
        assertThat(testStandingOrder.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testStandingOrder.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testStandingOrder.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testStandingOrder.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingStandingOrder() throws Exception {
        int databaseSizeBeforeUpdate = standingOrderRepository.findAll().size();
        standingOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStandingOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, standingOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(standingOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the StandingOrder in the database
        List<StandingOrder> standingOrderList = standingOrderRepository.findAll();
        assertThat(standingOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStandingOrder() throws Exception {
        int databaseSizeBeforeUpdate = standingOrderRepository.findAll().size();
        standingOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStandingOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(standingOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the StandingOrder in the database
        List<StandingOrder> standingOrderList = standingOrderRepository.findAll();
        assertThat(standingOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStandingOrder() throws Exception {
        int databaseSizeBeforeUpdate = standingOrderRepository.findAll().size();
        standingOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStandingOrderMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(standingOrder)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the StandingOrder in the database
        List<StandingOrder> standingOrderList = standingOrderRepository.findAll();
        assertThat(standingOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStandingOrderWithPatch() throws Exception {
        // Initialize the database
        standingOrderRepository.saveAndFlush(standingOrder);

        int databaseSizeBeforeUpdate = standingOrderRepository.findAll().size();

        // Update the standingOrder using partial update
        StandingOrder partialUpdatedStandingOrder = new StandingOrder();
        partialUpdatedStandingOrder.setId(standingOrder.getId());

        partialUpdatedStandingOrder.externalId(UPDATED_EXTERNAL_ID).label(UPDATED_LABEL).status(UPDATED_STATUS);

        restStandingOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStandingOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStandingOrder))
            )
            .andExpect(status().isOk());

        // Validate the StandingOrder in the database
        List<StandingOrder> standingOrderList = standingOrderRepository.findAll();
        assertThat(standingOrderList).hasSize(databaseSizeBeforeUpdate);
        StandingOrder testStandingOrder = standingOrderList.get(standingOrderList.size() - 1);
        assertThat(testStandingOrder.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testStandingOrder.getReference()).isEqualTo(DEFAULT_REFERENCE);
        assertThat(testStandingOrder.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testStandingOrder.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateStandingOrderWithPatch() throws Exception {
        // Initialize the database
        standingOrderRepository.saveAndFlush(standingOrder);

        int databaseSizeBeforeUpdate = standingOrderRepository.findAll().size();

        // Update the standingOrder using partial update
        StandingOrder partialUpdatedStandingOrder = new StandingOrder();
        partialUpdatedStandingOrder.setId(standingOrder.getId());

        partialUpdatedStandingOrder
            .externalId(UPDATED_EXTERNAL_ID)
            .reference(UPDATED_REFERENCE)
            .label(UPDATED_LABEL)
            .status(UPDATED_STATUS);

        restStandingOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStandingOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStandingOrder))
            )
            .andExpect(status().isOk());

        // Validate the StandingOrder in the database
        List<StandingOrder> standingOrderList = standingOrderRepository.findAll();
        assertThat(standingOrderList).hasSize(databaseSizeBeforeUpdate);
        StandingOrder testStandingOrder = standingOrderList.get(standingOrderList.size() - 1);
        assertThat(testStandingOrder.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testStandingOrder.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testStandingOrder.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testStandingOrder.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingStandingOrder() throws Exception {
        int databaseSizeBeforeUpdate = standingOrderRepository.findAll().size();
        standingOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStandingOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, standingOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(standingOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the StandingOrder in the database
        List<StandingOrder> standingOrderList = standingOrderRepository.findAll();
        assertThat(standingOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStandingOrder() throws Exception {
        int databaseSizeBeforeUpdate = standingOrderRepository.findAll().size();
        standingOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStandingOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(standingOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the StandingOrder in the database
        List<StandingOrder> standingOrderList = standingOrderRepository.findAll();
        assertThat(standingOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStandingOrder() throws Exception {
        int databaseSizeBeforeUpdate = standingOrderRepository.findAll().size();
        standingOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStandingOrderMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(standingOrder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the StandingOrder in the database
        List<StandingOrder> standingOrderList = standingOrderRepository.findAll();
        assertThat(standingOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStandingOrder() throws Exception {
        // Initialize the database
        standingOrderRepository.saveAndFlush(standingOrder);

        int databaseSizeBeforeDelete = standingOrderRepository.findAll().size();

        // Delete the standingOrder
        restStandingOrderMockMvc
            .perform(delete(ENTITY_API_URL_ID, standingOrder.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<StandingOrder> standingOrderList = standingOrderRepository.findAll();
        assertThat(standingOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
