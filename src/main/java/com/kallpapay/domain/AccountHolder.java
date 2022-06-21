package com.kallpapay.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AccountHolder.
 */
@Entity
@Table(name = "account_holder")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AccountHolder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "external_id")
    private String externalId;

    @Column(name = "verification_status")
    private String verificationStatus;

    @Column(name = "status_info")
    private String statusInfo;

    @OneToOne
    @JoinColumn(unique = true)
    private AccountHolderInfo accountHolderInfo;

    @OneToOne
    @JoinColumn(unique = true)
    private AddressInfo residencyAddress;

    @OneToMany(mappedBy = "accountHolder")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "balances", "accountMemberships", "iBANS", "transactions", "accountHolder" }, allowSetters = true)
    private Set<BankAccount> bankAccounts = new HashSet<>();

    @OneToMany(mappedBy = "accountHolder")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "accountHolder", "onboarding" }, allowSetters = true)
    private Set<SupportingDocument> supportingDocuments = new HashSet<>();

    @JsonIgnoreProperties(value = { "accountHolder", "oAuthRedirectParameters", "supportingDocuments" }, allowSetters = true)
    @OneToOne(mappedBy = "accountHolder")
    private Onboarding onboarding;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AccountHolder id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExternalId() {
        return this.externalId;
    }

    public AccountHolder externalId(String externalId) {
        this.setExternalId(externalId);
        return this;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getVerificationStatus() {
        return this.verificationStatus;
    }

    public AccountHolder verificationStatus(String verificationStatus) {
        this.setVerificationStatus(verificationStatus);
        return this;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getStatusInfo() {
        return this.statusInfo;
    }

    public AccountHolder statusInfo(String statusInfo) {
        this.setStatusInfo(statusInfo);
        return this;
    }

    public void setStatusInfo(String statusInfo) {
        this.statusInfo = statusInfo;
    }

    public AccountHolderInfo getAccountHolderInfo() {
        return this.accountHolderInfo;
    }

    public void setAccountHolderInfo(AccountHolderInfo accountHolderInfo) {
        this.accountHolderInfo = accountHolderInfo;
    }

    public AccountHolder accountHolderInfo(AccountHolderInfo accountHolderInfo) {
        this.setAccountHolderInfo(accountHolderInfo);
        return this;
    }

    public AddressInfo getResidencyAddress() {
        return this.residencyAddress;
    }

    public void setResidencyAddress(AddressInfo addressInfo) {
        this.residencyAddress = addressInfo;
    }

    public AccountHolder residencyAddress(AddressInfo addressInfo) {
        this.setResidencyAddress(addressInfo);
        return this;
    }

    public Set<BankAccount> getBankAccounts() {
        return this.bankAccounts;
    }

    public void setBankAccounts(Set<BankAccount> bankAccounts) {
        if (this.bankAccounts != null) {
            this.bankAccounts.forEach(i -> i.setAccountHolder(null));
        }
        if (bankAccounts != null) {
            bankAccounts.forEach(i -> i.setAccountHolder(this));
        }
        this.bankAccounts = bankAccounts;
    }

    public AccountHolder bankAccounts(Set<BankAccount> bankAccounts) {
        this.setBankAccounts(bankAccounts);
        return this;
    }

    public AccountHolder addBankAccount(BankAccount bankAccount) {
        this.bankAccounts.add(bankAccount);
        bankAccount.setAccountHolder(this);
        return this;
    }

    public AccountHolder removeBankAccount(BankAccount bankAccount) {
        this.bankAccounts.remove(bankAccount);
        bankAccount.setAccountHolder(null);
        return this;
    }

    public Set<SupportingDocument> getSupportingDocuments() {
        return this.supportingDocuments;
    }

    public void setSupportingDocuments(Set<SupportingDocument> supportingDocuments) {
        if (this.supportingDocuments != null) {
            this.supportingDocuments.forEach(i -> i.setAccountHolder(null));
        }
        if (supportingDocuments != null) {
            supportingDocuments.forEach(i -> i.setAccountHolder(this));
        }
        this.supportingDocuments = supportingDocuments;
    }

    public AccountHolder supportingDocuments(Set<SupportingDocument> supportingDocuments) {
        this.setSupportingDocuments(supportingDocuments);
        return this;
    }

    public AccountHolder addSupportingDocument(SupportingDocument supportingDocument) {
        this.supportingDocuments.add(supportingDocument);
        supportingDocument.setAccountHolder(this);
        return this;
    }

    public AccountHolder removeSupportingDocument(SupportingDocument supportingDocument) {
        this.supportingDocuments.remove(supportingDocument);
        supportingDocument.setAccountHolder(null);
        return this;
    }

    public Onboarding getOnboarding() {
        return this.onboarding;
    }

    public void setOnboarding(Onboarding onboarding) {
        if (this.onboarding != null) {
            this.onboarding.setAccountHolder(null);
        }
        if (onboarding != null) {
            onboarding.setAccountHolder(this);
        }
        this.onboarding = onboarding;
    }

    public AccountHolder onboarding(Onboarding onboarding) {
        this.setOnboarding(onboarding);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AccountHolder)) {
            return false;
        }
        return id != null && id.equals(((AccountHolder) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AccountHolder{" +
            "id=" + getId() +
            ", externalId='" + getExternalId() + "'" +
            ", verificationStatus='" + getVerificationStatus() + "'" +
            ", statusInfo='" + getStatusInfo() + "'" +
            "}";
    }
}
