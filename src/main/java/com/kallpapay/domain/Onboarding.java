package com.kallpapay.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Onboarding.
 */
@Entity
@Table(name = "onboarding")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Onboarding implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "external_id")
    private String externalId;

    @Column(name = "account_name")
    private String accountName;

    @Column(name = "email")
    private String email;

    @Column(name = "language")
    private String language;

    @Column(name = "account_holder_type")
    private String accountHolderType;

    @Column(name = "onboarding_url")
    private String onboardingUrl;

    @Column(name = "onboarding_state")
    private String onboardingState;

    @Column(name = "redirect_url")
    private String redirectUrl;

    @Column(name = "status")
    private String status;

    @Column(name = "tcu_url")
    private String tcuUrl;

    @JsonIgnoreProperties(
        value = { "accountHolderInfo", "residencyAddress", "bankAccounts", "supportingDocuments", "onboarding" },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private AccountHolder accountHolder;

    @OneToOne
    @JoinColumn(unique = true)
    private OAuthRedirectParameters oAuthRedirectParameters;

    @OneToMany(mappedBy = "onboarding")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "accountHolder", "onboarding" }, allowSetters = true)
    private Set<SupportingDocument> supportingDocuments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Onboarding id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExternalId() {
        return this.externalId;
    }

    public Onboarding externalId(String externalId) {
        this.setExternalId(externalId);
        return this;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getAccountName() {
        return this.accountName;
    }

    public Onboarding accountName(String accountName) {
        this.setAccountName(accountName);
        return this;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getEmail() {
        return this.email;
    }

    public Onboarding email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLanguage() {
        return this.language;
    }

    public Onboarding language(String language) {
        this.setLanguage(language);
        return this;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getAccountHolderType() {
        return this.accountHolderType;
    }

    public Onboarding accountHolderType(String accountHolderType) {
        this.setAccountHolderType(accountHolderType);
        return this;
    }

    public void setAccountHolderType(String accountHolderType) {
        this.accountHolderType = accountHolderType;
    }

    public String getOnboardingUrl() {
        return this.onboardingUrl;
    }

    public Onboarding onboardingUrl(String onboardingUrl) {
        this.setOnboardingUrl(onboardingUrl);
        return this;
    }

    public void setOnboardingUrl(String onboardingUrl) {
        this.onboardingUrl = onboardingUrl;
    }

    public String getOnboardingState() {
        return this.onboardingState;
    }

    public Onboarding onboardingState(String onboardingState) {
        this.setOnboardingState(onboardingState);
        return this;
    }

    public void setOnboardingState(String onboardingState) {
        this.onboardingState = onboardingState;
    }

    public String getRedirectUrl() {
        return this.redirectUrl;
    }

    public Onboarding redirectUrl(String redirectUrl) {
        this.setRedirectUrl(redirectUrl);
        return this;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    public String getStatus() {
        return this.status;
    }

    public Onboarding status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTcuUrl() {
        return this.tcuUrl;
    }

    public Onboarding tcuUrl(String tcuUrl) {
        this.setTcuUrl(tcuUrl);
        return this;
    }

    public void setTcuUrl(String tcuUrl) {
        this.tcuUrl = tcuUrl;
    }

    public AccountHolder getAccountHolder() {
        return this.accountHolder;
    }

    public void setAccountHolder(AccountHolder accountHolder) {
        this.accountHolder = accountHolder;
    }

    public Onboarding accountHolder(AccountHolder accountHolder) {
        this.setAccountHolder(accountHolder);
        return this;
    }

    public OAuthRedirectParameters getOAuthRedirectParameters() {
        return this.oAuthRedirectParameters;
    }

    public void setOAuthRedirectParameters(OAuthRedirectParameters oAuthRedirectParameters) {
        this.oAuthRedirectParameters = oAuthRedirectParameters;
    }

    public Onboarding oAuthRedirectParameters(OAuthRedirectParameters oAuthRedirectParameters) {
        this.setOAuthRedirectParameters(oAuthRedirectParameters);
        return this;
    }

    public Set<SupportingDocument> getSupportingDocuments() {
        return this.supportingDocuments;
    }

    public void setSupportingDocuments(Set<SupportingDocument> supportingDocuments) {
        if (this.supportingDocuments != null) {
            this.supportingDocuments.forEach(i -> i.setOnboarding(null));
        }
        if (supportingDocuments != null) {
            supportingDocuments.forEach(i -> i.setOnboarding(this));
        }
        this.supportingDocuments = supportingDocuments;
    }

    public Onboarding supportingDocuments(Set<SupportingDocument> supportingDocuments) {
        this.setSupportingDocuments(supportingDocuments);
        return this;
    }

    public Onboarding addSupportingDocument(SupportingDocument supportingDocument) {
        this.supportingDocuments.add(supportingDocument);
        supportingDocument.setOnboarding(this);
        return this;
    }

    public Onboarding removeSupportingDocument(SupportingDocument supportingDocument) {
        this.supportingDocuments.remove(supportingDocument);
        supportingDocument.setOnboarding(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Onboarding)) {
            return false;
        }
        return id != null && id.equals(((Onboarding) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Onboarding{" +
            "id=" + getId() +
            ", externalId='" + getExternalId() + "'" +
            ", accountName='" + getAccountName() + "'" +
            ", email='" + getEmail() + "'" +
            ", language='" + getLanguage() + "'" +
            ", accountHolderType='" + getAccountHolderType() + "'" +
            ", onboardingUrl='" + getOnboardingUrl() + "'" +
            ", onboardingState='" + getOnboardingState() + "'" +
            ", redirectUrl='" + getRedirectUrl() + "'" +
            ", status='" + getStatus() + "'" +
            ", tcuUrl='" + getTcuUrl() + "'" +
            "}";
    }
}
