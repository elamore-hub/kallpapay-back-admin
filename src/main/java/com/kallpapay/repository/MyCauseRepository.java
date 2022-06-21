package com.kallpapay.repository;

import com.kallpapay.domain.MyCause;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the MyCause entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MyCauseRepository extends JpaRepository<MyCause, Long> {}
