package com.kallpapay.repository;

import com.kallpapay.domain.AccountMembership;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AccountMembership entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AccountMembershipRepository extends JpaRepository<AccountMembership, Long> {}
