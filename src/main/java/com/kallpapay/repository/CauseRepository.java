package com.kallpapay.repository;

import com.kallpapay.domain.Cause;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Cause entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CauseRepository extends JpaRepository<Cause, Long> {}
