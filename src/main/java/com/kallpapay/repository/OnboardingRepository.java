package com.kallpapay.repository;

import com.kallpapay.domain.Onboarding;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Onboarding entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OnboardingRepository extends JpaRepository<Onboarding, Long> {}
