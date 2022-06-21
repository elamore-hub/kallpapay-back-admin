package com.kallpapay.repository;

import com.kallpapay.domain.AccountBalances;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AccountBalances entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AccountBalancesRepository extends JpaRepository<AccountBalances, Long> {}
