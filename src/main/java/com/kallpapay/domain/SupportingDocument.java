package com.kallpapay.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SupportingDocument.
 */
@Entity
@Table(name = "supporting_document")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SupportingDocument implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "external_id")
    private String externalId;

    @Column(name = "status")
    private String status;

    @Column(name = "supporting_document_type")
    private String supportingDocumentType;

    @Column(name = "supporting_document_purpose")
    private String supportingDocumentPurpose;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "accountHolderInfo", "residencyAddress", "bankAccounts", "supportingDocuments", "onboarding" },
        allowSetters = true
    )
    private AccountHolder accountHolder;

    @ManyToOne
    @JsonIgnoreProperties(value = { "accountHolder", "oAuthRedirectParameters", "supportingDocuments" }, allowSetters = true)
    private Onboarding onboarding;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SupportingDocument id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExternalId() {
        return this.externalId;
    }

    public SupportingDocument externalId(String externalId) {
        this.setExternalId(externalId);
        return this;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getStatus() {
        return this.status;
    }

    public SupportingDocument status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSupportingDocumentType() {
        return this.supportingDocumentType;
    }

    public SupportingDocument supportingDocumentType(String supportingDocumentType) {
        this.setSupportingDocumentType(supportingDocumentType);
        return this;
    }

    public void setSupportingDocumentType(String supportingDocumentType) {
        this.supportingDocumentType = supportingDocumentType;
    }

    public String getSupportingDocumentPurpose() {
        return this.supportingDocumentPurpose;
    }

    public SupportingDocument supportingDocumentPurpose(String supportingDocumentPurpose) {
        this.setSupportingDocumentPurpose(supportingDocumentPurpose);
        return this;
    }

    public void setSupportingDocumentPurpose(String supportingDocumentPurpose) {
        this.supportingDocumentPurpose = supportingDocumentPurpose;
    }

    public AccountHolder getAccountHolder() {
        return this.accountHolder;
    }

    public void setAccountHolder(AccountHolder accountHolder) {
        this.accountHolder = accountHolder;
    }

    public SupportingDocument accountHolder(AccountHolder accountHolder) {
        this.setAccountHolder(accountHolder);
        return this;
    }

    public Onboarding getOnboarding() {
        return this.onboarding;
    }

    public void setOnboarding(Onboarding onboarding) {
        this.onboarding = onboarding;
    }

    public SupportingDocument onboarding(Onboarding onboarding) {
        this.setOnboarding(onboarding);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SupportingDocument)) {
            return false;
        }
        return id != null && id.equals(((SupportingDocument) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SupportingDocument{" +
            "id=" + getId() +
            ", externalId='" + getExternalId() + "'" +
            ", status='" + getStatus() + "'" +
            ", supportingDocumentType='" + getSupportingDocumentType() + "'" +
            ", supportingDocumentPurpose='" + getSupportingDocumentPurpose() + "'" +
            "}";
    }
}
