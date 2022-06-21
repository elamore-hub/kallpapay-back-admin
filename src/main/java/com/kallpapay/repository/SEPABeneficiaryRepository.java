package com.kallpapay.repository;

import com.kallpapay.domain.SEPABeneficiary;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SEPABeneficiary entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SEPABeneficiaryRepository extends JpaRepository<SEPABeneficiary, Long> {}
