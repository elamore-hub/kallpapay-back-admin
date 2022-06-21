package com.kallpapay.repository;

import com.kallpapay.domain.AccountHolder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AccountHolder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AccountHolderRepository extends JpaRepository<AccountHolder, Long> {}
