package com.kallpapay.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kallpapay.IntegrationTest;
import com.kallpapay.domain.Transaction;
import com.kallpapay.repository.TransactionRepository;
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
 * Integration tests for the {@link TransactionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TransactionResourceIT {

    private static final String DEFAULT_EXTERNAL_ID = "AAAAAAAAAA";
    private static final String UPDATED_EXTERNAL_ID = "BBBBBBBBBB";

    private static final String DEFAULT_REFERENCE = "AAAAAAAAAA";
    private static final String UPDATED_REFERENCE = "BBBBBBBBBB";

    private static final String DEFAULT_PAYMENT_METHOD_IDENTIFIER = "AAAAAAAAAA";
    private static final String UPDATED_PAYMENT_METHOD_IDENTIFIER = "BBBBBBBBBB";

    private static final String DEFAULT_SIDE = "AAAAAAAAAA";
    private static final String UPDATED_SIDE = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_PAYMENT_ID = "AAAAAAAAAA";
    private static final String UPDATED_PAYMENT_ID = "BBBBBBBBBB";

    private static final String DEFAULT_COUNTERPARTY = "AAAAAAAAAA";
    private static final String UPDATED_COUNTERPARTY = "BBBBBBBBBB";

    private static final String DEFAULT_PAYMENT_PRODUCT = "AAAAAAAAAA";
    private static final String UPDATED_PAYMENT_PRODUCT = "BBBBBBBBBB";

    private static final String DEFAULT_EXTERNAL_REFERENCE = "AAAAAAAAAA";
    private static final String UPDATED_EXTERNAL_REFERENCE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/transactions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTransactionMockMvc;

    private Transaction transaction;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Transaction createEntity(EntityManager em) {
        Transaction transaction = new Transaction()
            .externalId(DEFAULT_EXTERNAL_ID)
            .reference(DEFAULT_REFERENCE)
            .paymentMethodIdentifier(DEFAULT_PAYMENT_METHOD_IDENTIFIER)
            .side(DEFAULT_SIDE)
            .type(DEFAULT_TYPE)
            .label(DEFAULT_LABEL)
            .status(DEFAULT_STATUS)
            .paymentId(DEFAULT_PAYMENT_ID)
            .counterparty(DEFAULT_COUNTERPARTY)
            .paymentProduct(DEFAULT_PAYMENT_PRODUCT)
            .externalReference(DEFAULT_EXTERNAL_REFERENCE);
        return transaction;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Transaction createUpdatedEntity(EntityManager em) {
        Transaction transaction = new Transaction()
            .externalId(UPDATED_EXTERNAL_ID)
            .reference(UPDATED_REFERENCE)
            .paymentMethodIdentifier(UPDATED_PAYMENT_METHOD_IDENTIFIER)
            .side(UPDATED_SIDE)
            .type(UPDATED_TYPE)
            .label(UPDATED_LABEL)
            .status(UPDATED_STATUS)
            .paymentId(UPDATED_PAYMENT_ID)
            .counterparty(UPDATED_COUNTERPARTY)
            .paymentProduct(UPDATED_PAYMENT_PRODUCT)
            .externalReference(UPDATED_EXTERNAL_REFERENCE);
        return transaction;
    }

    @BeforeEach
    public void initTest() {
        transaction = createEntity(em);
    }

    @Test
    @Transactional
    void createTransaction() throws Exception {
        int databaseSizeBeforeCreate = transactionRepository.findAll().size();
        // Create the Transaction
        restTransactionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(transaction)))
            .andExpect(status().isCreated());

        // Validate the Transaction in the database
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeCreate + 1);
        Transaction testTransaction = transactionList.get(transactionList.size() - 1);
        assertThat(testTransaction.getExternalId()).isEqualTo(DEFAULT_EXTERNAL_ID);
        assertThat(testTransaction.getReference()).isEqualTo(DEFAULT_REFERENCE);
        assertThat(testTransaction.getPaymentMethodIdentifier()).isEqualTo(DEFAULT_PAYMENT_METHOD_IDENTIFIER);
        assertThat(testTransaction.getSide()).isEqualTo(DEFAULT_SIDE);
        assertThat(testTransaction.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testTransaction.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testTransaction.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testTransaction.getPaymentId()).isEqualTo(DEFAULT_PAYMENT_ID);
        assertThat(testTransaction.getCounterparty()).isEqualTo(DEFAULT_COUNTERPARTY);
        assertThat(testTransaction.getPaymentProduct()).isEqualTo(DEFAULT_PAYMENT_PRODUCT);
        assertThat(testTransaction.getExternalReference()).isEqualTo(DEFAULT_EXTERNAL_REFERENCE);
    }

    @Test
    @Transactional
    void createTransactionWithExistingId() throws Exception {
        // Create the Transaction with an existing ID
        transaction.setId(1L);

        int databaseSizeBeforeCreate = transactionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTransactionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(transaction)))
            .andExpect(status().isBadRequest());

        // Validate the Transaction in the database
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTransactions() throws Exception {
        // Initialize the database
        transactionRepository.saveAndFlush(transaction);

        // Get all the transactionList
        restTransactionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(transaction.getId().intValue())))
            .andExpect(jsonPath("$.[*].externalId").value(hasItem(DEFAULT_EXTERNAL_ID)))
            .andExpect(jsonPath("$.[*].reference").value(hasItem(DEFAULT_REFERENCE)))
            .andExpect(jsonPath("$.[*].paymentMethodIdentifier").value(hasItem(DEFAULT_PAYMENT_METHOD_IDENTIFIER)))
            .andExpect(jsonPath("$.[*].side").value(hasItem(DEFAULT_SIDE)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].paymentId").value(hasItem(DEFAULT_PAYMENT_ID)))
            .andExpect(jsonPath("$.[*].counterparty").value(hasItem(DEFAULT_COUNTERPARTY)))
            .andExpect(jsonPath("$.[*].paymentProduct").value(hasItem(DEFAULT_PAYMENT_PRODUCT)))
            .andExpect(jsonPath("$.[*].externalReference").value(hasItem(DEFAULT_EXTERNAL_REFERENCE)));
    }

    @Test
    @Transactional
    void getTransaction() throws Exception {
        // Initialize the database
        transactionRepository.saveAndFlush(transaction);

        // Get the transaction
        restTransactionMockMvc
            .perform(get(ENTITY_API_URL_ID, transaction.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(transaction.getId().intValue()))
            .andExpect(jsonPath("$.externalId").value(DEFAULT_EXTERNAL_ID))
            .andExpect(jsonPath("$.reference").value(DEFAULT_REFERENCE))
            .andExpect(jsonPath("$.paymentMethodIdentifier").value(DEFAULT_PAYMENT_METHOD_IDENTIFIER))
            .andExpect(jsonPath("$.side").value(DEFAULT_SIDE))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.paymentId").value(DEFAULT_PAYMENT_ID))
            .andExpect(jsonPath("$.counterparty").value(DEFAULT_COUNTERPARTY))
            .andExpect(jsonPath("$.paymentProduct").value(DEFAULT_PAYMENT_PRODUCT))
            .andExpect(jsonPath("$.externalReference").value(DEFAULT_EXTERNAL_REFERENCE));
    }

    @Test
    @Transactional
    void getNonExistingTransaction() throws Exception {
        // Get the transaction
        restTransactionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTransaction() throws Exception {
        // Initialize the database
        transactionRepository.saveAndFlush(transaction);

        int databaseSizeBeforeUpdate = transactionRepository.findAll().size();

        // Update the transaction
        Transaction updatedTransaction = transactionRepository.findById(transaction.getId()).get();
        // Disconnect from session so that the updates on updatedTransaction are not directly saved in db
        em.detach(updatedTransaction);
        updatedTransaction
            .externalId(UPDATED_EXTERNAL_ID)
            .reference(UPDATED_REFERENCE)
            .paymentMethodIdentifier(UPDATED_PAYMENT_METHOD_IDENTIFIER)
            .side(UPDATED_SIDE)
            .type(UPDATED_TYPE)
            .label(UPDATED_LABEL)
            .status(UPDATED_STATUS)
            .paymentId(UPDATED_PAYMENT_ID)
            .counterparty(UPDATED_COUNTERPARTY)
            .paymentProduct(UPDATED_PAYMENT_PRODUCT)
            .externalReference(UPDATED_EXTERNAL_REFERENCE);

        restTransactionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTransaction.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTransaction))
            )
            .andExpect(status().isOk());

        // Validate the Transaction in the database
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeUpdate);
        Transaction testTransaction = transactionList.get(transactionList.size() - 1);
        assertThat(testTransaction.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testTransaction.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testTransaction.getPaymentMethodIdentifier()).isEqualTo(UPDATED_PAYMENT_METHOD_IDENTIFIER);
        assertThat(testTransaction.getSide()).isEqualTo(UPDATED_SIDE);
        assertThat(testTransaction.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testTransaction.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testTransaction.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testTransaction.getPaymentId()).isEqualTo(UPDATED_PAYMENT_ID);
        assertThat(testTransaction.getCounterparty()).isEqualTo(UPDATED_COUNTERPARTY);
        assertThat(testTransaction.getPaymentProduct()).isEqualTo(UPDATED_PAYMENT_PRODUCT);
        assertThat(testTransaction.getExternalReference()).isEqualTo(UPDATED_EXTERNAL_REFERENCE);
    }

    @Test
    @Transactional
    void putNonExistingTransaction() throws Exception {
        int databaseSizeBeforeUpdate = transactionRepository.findAll().size();
        transaction.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTransactionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, transaction.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(transaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the Transaction in the database
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTransaction() throws Exception {
        int databaseSizeBeforeUpdate = transactionRepository.findAll().size();
        transaction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTransactionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(transaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the Transaction in the database
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTransaction() throws Exception {
        int databaseSizeBeforeUpdate = transactionRepository.findAll().size();
        transaction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTransactionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(transaction)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Transaction in the database
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTransactionWithPatch() throws Exception {
        // Initialize the database
        transactionRepository.saveAndFlush(transaction);

        int databaseSizeBeforeUpdate = transactionRepository.findAll().size();

        // Update the transaction using partial update
        Transaction partialUpdatedTransaction = new Transaction();
        partialUpdatedTransaction.setId(transaction.getId());

        partialUpdatedTransaction
            .reference(UPDATED_REFERENCE)
            .counterparty(UPDATED_COUNTERPARTY)
            .paymentProduct(UPDATED_PAYMENT_PRODUCT)
            .externalReference(UPDATED_EXTERNAL_REFERENCE);

        restTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTransaction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTransaction))
            )
            .andExpect(status().isOk());

        // Validate the Transaction in the database
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeUpdate);
        Transaction testTransaction = transactionList.get(transactionList.size() - 1);
        assertThat(testTransaction.getExternalId()).isEqualTo(DEFAULT_EXTERNAL_ID);
        assertThat(testTransaction.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testTransaction.getPaymentMethodIdentifier()).isEqualTo(DEFAULT_PAYMENT_METHOD_IDENTIFIER);
        assertThat(testTransaction.getSide()).isEqualTo(DEFAULT_SIDE);
        assertThat(testTransaction.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testTransaction.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testTransaction.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testTransaction.getPaymentId()).isEqualTo(DEFAULT_PAYMENT_ID);
        assertThat(testTransaction.getCounterparty()).isEqualTo(UPDATED_COUNTERPARTY);
        assertThat(testTransaction.getPaymentProduct()).isEqualTo(UPDATED_PAYMENT_PRODUCT);
        assertThat(testTransaction.getExternalReference()).isEqualTo(UPDATED_EXTERNAL_REFERENCE);
    }

    @Test
    @Transactional
    void fullUpdateTransactionWithPatch() throws Exception {
        // Initialize the database
        transactionRepository.saveAndFlush(transaction);

        int databaseSizeBeforeUpdate = transactionRepository.findAll().size();

        // Update the transaction using partial update
        Transaction partialUpdatedTransaction = new Transaction();
        partialUpdatedTransaction.setId(transaction.getId());

        partialUpdatedTransaction
            .externalId(UPDATED_EXTERNAL_ID)
            .reference(UPDATED_REFERENCE)
            .paymentMethodIdentifier(UPDATED_PAYMENT_METHOD_IDENTIFIER)
            .side(UPDATED_SIDE)
            .type(UPDATED_TYPE)
            .label(UPDATED_LABEL)
            .status(UPDATED_STATUS)
            .paymentId(UPDATED_PAYMENT_ID)
            .counterparty(UPDATED_COUNTERPARTY)
            .paymentProduct(UPDATED_PAYMENT_PRODUCT)
            .externalReference(UPDATED_EXTERNAL_REFERENCE);

        restTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTransaction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTransaction))
            )
            .andExpect(status().isOk());

        // Validate the Transaction in the database
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeUpdate);
        Transaction testTransaction = transactionList.get(transactionList.size() - 1);
        assertThat(testTransaction.getExternalId()).isEqualTo(UPDATED_EXTERNAL_ID);
        assertThat(testTransaction.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testTransaction.getPaymentMethodIdentifier()).isEqualTo(UPDATED_PAYMENT_METHOD_IDENTIFIER);
        assertThat(testTransaction.getSide()).isEqualTo(UPDATED_SIDE);
        assertThat(testTransaction.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testTransaction.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testTransaction.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testTransaction.getPaymentId()).isEqualTo(UPDATED_PAYMENT_ID);
        assertThat(testTransaction.getCounterparty()).isEqualTo(UPDATED_COUNTERPARTY);
        assertThat(testTransaction.getPaymentProduct()).isEqualTo(UPDATED_PAYMENT_PRODUCT);
        assertThat(testTransaction.getExternalReference()).isEqualTo(UPDATED_EXTERNAL_REFERENCE);
    }

    @Test
    @Transactional
    void patchNonExistingTransaction() throws Exception {
        int databaseSizeBeforeUpdate = transactionRepository.findAll().size();
        transaction.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, transaction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(transaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the Transaction in the database
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTransaction() throws Exception {
        int databaseSizeBeforeUpdate = transactionRepository.findAll().size();
        transaction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(transaction))
            )
            .andExpect(status().isBadRequest());

        // Validate the Transaction in the database
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTransaction() throws Exception {
        int databaseSizeBeforeUpdate = transactionRepository.findAll().size();
        transaction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTransactionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(transaction))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Transaction in the database
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTransaction() throws Exception {
        // Initialize the database
        transactionRepository.saveAndFlush(transaction);

        int databaseSizeBeforeDelete = transactionRepository.findAll().size();

        // Delete the transaction
        restTransactionMockMvc
            .perform(delete(ENTITY_API_URL_ID, transaction.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
