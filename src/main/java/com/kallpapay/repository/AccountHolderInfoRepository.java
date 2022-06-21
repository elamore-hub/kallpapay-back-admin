package com.kallpapay.repository;

import com.kallpapay.domain.AccountHolderInfo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AccountHolderInfo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AccountHolderInfoRepository extends JpaRepository<AccountHolderInfo, Long> {}
