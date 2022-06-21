package com.kallpapay.repository;

import com.kallpapay.domain.SupportingDocument;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SupportingDocument entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SupportingDocumentRepository extends JpaRepository<SupportingDocument, Long> {}
