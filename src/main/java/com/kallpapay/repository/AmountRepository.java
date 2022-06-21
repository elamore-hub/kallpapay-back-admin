package com.kallpapay.repository;

import com.kallpapay.domain.Amount;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Amount entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AmountRepository extends JpaRepository<Amount, Long> {}
