package com.kallpapay.repository;

import com.kallpapay.domain.IBAN;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the IBAN entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IBANRepository extends JpaRepository<IBAN, Long> {}
