package com.kallpapay.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kallpapay.IntegrationTest;
import com.kallpapay.domain.Amount;
import com.kallpapay.repository.AmountRepository;
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
 * Integration tests for the {@link AmountResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AmountResourceIT {

    private static final String DEFAULT_CURRENCY = "AAAAAAAAAA";
    private static final String UPDATED_CURRENCY = "BBBBBBBBBB";

    private static final Long DEFAULT_VALUE = 1L;
    private static final Long UPDATED_VALUE = 2L;

    private static final String ENTITY_API_URL = "/api/amounts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AmountRepository amountRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAmountMockMvc;

    private Amount amount;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Amount createEntity(EntityManager em) {
        Amount amount = new Amount().currency(DEFAULT_CURRENCY).value(DEFAULT_VALUE);
        return amount;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Amount createUpdatedEntity(EntityManager em) {
        Amount amount = new Amount().currency(UPDATED_CURRENCY).value(UPDATED_VALUE);
        return amount;
    }

    @BeforeEach
    public void initTest() {
        amount = createEntity(em);
    }

    @Test
    @Transactional
    void createAmount() throws Exception {
        int databaseSizeBeforeCreate = amountRepository.findAll().size();
        // Create the Amount
        restAmountMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(amount)))
            .andExpect(status().isCreated());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeCreate + 1);
        Amount testAmount = amountList.get(amountList.size() - 1);
        assertThat(testAmount.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testAmount.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void createAmountWithExistingId() throws Exception {
        // Create the Amount with an existing ID
        amount.setId(1L);

        int databaseSizeBeforeCreate = amountRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAmountMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(amount)))
            .andExpect(status().isBadRequest());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAmounts() throws Exception {
        // Initialize the database
        amountRepository.saveAndFlush(amount);

        // Get all the amountList
        restAmountMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(amount.getId().intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY)))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.intValue())));
    }

    @Test
    @Transactional
    void getAmount() throws Exception {
        // Initialize the database
        amountRepository.saveAndFlush(amount);

        // Get the amount
        restAmountMockMvc
            .perform(get(ENTITY_API_URL_ID, amount.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(amount.getId().intValue()))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingAmount() throws Exception {
        // Get the amount
        restAmountMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAmount() throws Exception {
        // Initialize the database
        amountRepository.saveAndFlush(amount);

        int databaseSizeBeforeUpdate = amountRepository.findAll().size();

        // Update the amount
        Amount updatedAmount = amountRepository.findById(amount.getId()).get();
        // Disconnect from session so that the updates on updatedAmount are not directly saved in db
        em.detach(updatedAmount);
        updatedAmount.currency(UPDATED_CURRENCY).value(UPDATED_VALUE);

        restAmountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAmount.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAmount))
            )
            .andExpect(status().isOk());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
        Amount testAmount = amountList.get(amountList.size() - 1);
        assertThat(testAmount.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testAmount.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingAmount() throws Exception {
        int databaseSizeBeforeUpdate = amountRepository.findAll().size();
        amount.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAmountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, amount.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(amount))
            )
            .andExpect(status().isBadRequest());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAmount() throws Exception {
        int databaseSizeBeforeUpdate = amountRepository.findAll().size();
        amount.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAmountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(amount))
            )
            .andExpect(status().isBadRequest());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAmount() throws Exception {
        int databaseSizeBeforeUpdate = amountRepository.findAll().size();
        amount.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAmountMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(amount)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAmountWithPatch() throws Exception {
        // Initialize the database
        amountRepository.saveAndFlush(amount);

        int databaseSizeBeforeUpdate = amountRepository.findAll().size();

        // Update the amount using partial update
        Amount partialUpdatedAmount = new Amount();
        partialUpdatedAmount.setId(amount.getId());

        partialUpdatedAmount.value(UPDATED_VALUE);

        restAmountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAmount.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAmount))
            )
            .andExpect(status().isOk());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
        Amount testAmount = amountList.get(amountList.size() - 1);
        assertThat(testAmount.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testAmount.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void fullUpdateAmountWithPatch() throws Exception {
        // Initialize the database
        amountRepository.saveAndFlush(amount);

        int databaseSizeBeforeUpdate = amountRepository.findAll().size();

        // Update the amount using partial update
        Amount partialUpdatedAmount = new Amount();
        partialUpdatedAmount.setId(amount.getId());

        partialUpdatedAmount.currency(UPDATED_CURRENCY).value(UPDATED_VALUE);

        restAmountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAmount.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAmount))
            )
            .andExpect(status().isOk());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
        Amount testAmount = amountList.get(amountList.size() - 1);
        assertThat(testAmount.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testAmount.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingAmount() throws Exception {
        int databaseSizeBeforeUpdate = amountRepository.findAll().size();
        amount.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAmountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, amount.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(amount))
            )
            .andExpect(status().isBadRequest());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAmount() throws Exception {
        int databaseSizeBeforeUpdate = amountRepository.findAll().size();
        amount.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAmountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(amount))
            )
            .andExpect(status().isBadRequest());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAmount() throws Exception {
        int databaseSizeBeforeUpdate = amountRepository.findAll().size();
        amount.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAmountMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(amount)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Amount in the database
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAmount() throws Exception {
        // Initialize the database
        amountRepository.saveAndFlush(amount);

        int databaseSizeBeforeDelete = amountRepository.findAll().size();

        // Delete the amount
        restAmountMockMvc
            .perform(delete(ENTITY_API_URL_ID, amount.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Amount> amountList = amountRepository.findAll();
        assertThat(amountList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
