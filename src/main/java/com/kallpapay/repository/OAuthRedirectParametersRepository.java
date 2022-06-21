package com.kallpapay.repository;

import com.kallpapay.domain.OAuthRedirectParameters;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the OAuthRedirectParameters entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OAuthRedirectParametersRepository extends JpaRepository<OAuthRedirectParameters, Long> {}
