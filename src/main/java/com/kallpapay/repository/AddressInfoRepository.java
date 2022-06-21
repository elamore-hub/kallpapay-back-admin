package com.kallpapay.repository;

import com.kallpapay.domain.AddressInfo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AddressInfo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AddressInfoRepository extends JpaRepository<AddressInfo, Long> {}
