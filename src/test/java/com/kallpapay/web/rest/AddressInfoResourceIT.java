package com.kallpapay.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kallpapay.IntegrationTest;
import com.kallpapay.domain.AddressInfo;
import com.kallpapay.repository.AddressInfoRepository;
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
 * Integration tests for the {@link AddressInfoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AddressInfoResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/address-infos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AddressInfoRepository addressInfoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAddressInfoMockMvc;

    private AddressInfo addressInfo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AddressInfo createEntity(EntityManager em) {
        AddressInfo addressInfo = new AddressInfo().name(DEFAULT_NAME);
        return addressInfo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AddressInfo createUpdatedEntity(EntityManager em) {
        AddressInfo addressInfo = new AddressInfo().name(UPDATED_NAME);
        return addressInfo;
    }

    @BeforeEach
    public void initTest() {
        addressInfo = createEntity(em);
    }

    @Test
    @Transactional
    void createAddressInfo() throws Exception {
        int databaseSizeBeforeCreate = addressInfoRepository.findAll().size();
        // Create the AddressInfo
        restAddressInfoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(addressInfo)))
            .andExpect(status().isCreated());

        // Validate the AddressInfo in the database
        List<AddressInfo> addressInfoList = addressInfoRepository.findAll();
        assertThat(addressInfoList).hasSize(databaseSizeBeforeCreate + 1);
        AddressInfo testAddressInfo = addressInfoList.get(addressInfoList.size() - 1);
        assertThat(testAddressInfo.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createAddressInfoWithExistingId() throws Exception {
        // Create the AddressInfo with an existing ID
        addressInfo.setId(1L);

        int databaseSizeBeforeCreate = addressInfoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAddressInfoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(addressInfo)))
            .andExpect(status().isBadRequest());

        // Validate the AddressInfo in the database
        List<AddressInfo> addressInfoList = addressInfoRepository.findAll();
        assertThat(addressInfoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAddressInfos() throws Exception {
        // Initialize the database
        addressInfoRepository.saveAndFlush(addressInfo);

        // Get all the addressInfoList
        restAddressInfoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(addressInfo.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getAddressInfo() throws Exception {
        // Initialize the database
        addressInfoRepository.saveAndFlush(addressInfo);

        // Get the addressInfo
        restAddressInfoMockMvc
            .perform(get(ENTITY_API_URL_ID, addressInfo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(addressInfo.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingAddressInfo() throws Exception {
        // Get the addressInfo
        restAddressInfoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAddressInfo() throws Exception {
        // Initialize the database
        addressInfoRepository.saveAndFlush(addressInfo);

        int databaseSizeBeforeUpdate = addressInfoRepository.findAll().size();

        // Update the addressInfo
        AddressInfo updatedAddressInfo = addressInfoRepository.findById(addressInfo.getId()).get();
        // Disconnect from session so that the updates on updatedAddressInfo are not directly saved in db
        em.detach(updatedAddressInfo);
        updatedAddressInfo.name(UPDATED_NAME);

        restAddressInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAddressInfo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAddressInfo))
            )
            .andExpect(status().isOk());

        // Validate the AddressInfo in the database
        List<AddressInfo> addressInfoList = addressInfoRepository.findAll();
        assertThat(addressInfoList).hasSize(databaseSizeBeforeUpdate);
        AddressInfo testAddressInfo = addressInfoList.get(addressInfoList.size() - 1);
        assertThat(testAddressInfo.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingAddressInfo() throws Exception {
        int databaseSizeBeforeUpdate = addressInfoRepository.findAll().size();
        addressInfo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAddressInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, addressInfo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(addressInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the AddressInfo in the database
        List<AddressInfo> addressInfoList = addressInfoRepository.findAll();
        assertThat(addressInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAddressInfo() throws Exception {
        int databaseSizeBeforeUpdate = addressInfoRepository.findAll().size();
        addressInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAddressInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(addressInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the AddressInfo in the database
        List<AddressInfo> addressInfoList = addressInfoRepository.findAll();
        assertThat(addressInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAddressInfo() throws Exception {
        int databaseSizeBeforeUpdate = addressInfoRepository.findAll().size();
        addressInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAddressInfoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(addressInfo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AddressInfo in the database
        List<AddressInfo> addressInfoList = addressInfoRepository.findAll();
        assertThat(addressInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAddressInfoWithPatch() throws Exception {
        // Initialize the database
        addressInfoRepository.saveAndFlush(addressInfo);

        int databaseSizeBeforeUpdate = addressInfoRepository.findAll().size();

        // Update the addressInfo using partial update
        AddressInfo partialUpdatedAddressInfo = new AddressInfo();
        partialUpdatedAddressInfo.setId(addressInfo.getId());

        restAddressInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAddressInfo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAddressInfo))
            )
            .andExpect(status().isOk());

        // Validate the AddressInfo in the database
        List<AddressInfo> addressInfoList = addressInfoRepository.findAll();
        assertThat(addressInfoList).hasSize(databaseSizeBeforeUpdate);
        AddressInfo testAddressInfo = addressInfoList.get(addressInfoList.size() - 1);
        assertThat(testAddressInfo.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateAddressInfoWithPatch() throws Exception {
        // Initialize the database
        addressInfoRepository.saveAndFlush(addressInfo);

        int databaseSizeBeforeUpdate = addressInfoRepository.findAll().size();

        // Update the addressInfo using partial update
        AddressInfo partialUpdatedAddressInfo = new AddressInfo();
        partialUpdatedAddressInfo.setId(addressInfo.getId());

        partialUpdatedAddressInfo.name(UPDATED_NAME);

        restAddressInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAddressInfo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAddressInfo))
            )
            .andExpect(status().isOk());

        // Validate the AddressInfo in the database
        List<AddressInfo> addressInfoList = addressInfoRepository.findAll();
        assertThat(addressInfoList).hasSize(databaseSizeBeforeUpdate);
        AddressInfo testAddressInfo = addressInfoList.get(addressInfoList.size() - 1);
        assertThat(testAddressInfo.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingAddressInfo() throws Exception {
        int databaseSizeBeforeUpdate = addressInfoRepository.findAll().size();
        addressInfo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAddressInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, addressInfo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(addressInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the AddressInfo in the database
        List<AddressInfo> addressInfoList = addressInfoRepository.findAll();
        assertThat(addressInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAddressInfo() throws Exception {
        int databaseSizeBeforeUpdate = addressInfoRepository.findAll().size();
        addressInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAddressInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(addressInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the AddressInfo in the database
        List<AddressInfo> addressInfoList = addressInfoRepository.findAll();
        assertThat(addressInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAddressInfo() throws Exception {
        int databaseSizeBeforeUpdate = addressInfoRepository.findAll().size();
        addressInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAddressInfoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(addressInfo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AddressInfo in the database
        List<AddressInfo> addressInfoList = addressInfoRepository.findAll();
        assertThat(addressInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAddressInfo() throws Exception {
        // Initialize the database
        addressInfoRepository.saveAndFlush(addressInfo);

        int databaseSizeBeforeDelete = addressInfoRepository.findAll().size();

        // Delete the addressInfo
        restAddressInfoMockMvc
            .perform(delete(ENTITY_API_URL_ID, addressInfo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AddressInfo> addressInfoList = addressInfoRepository.findAll();
        assertThat(addressInfoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
