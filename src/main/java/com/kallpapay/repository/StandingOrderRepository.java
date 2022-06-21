package com.kallpapay.repository;

import com.kallpapay.domain.StandingOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the StandingOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StandingOrderRepository extends JpaRepository<StandingOrder, Long> {}
