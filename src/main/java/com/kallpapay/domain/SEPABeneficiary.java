package com.kallpapay.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SEPABeneficiary.
 */
@Entity
@Table(name = "sepa_beneficiary")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SEPABeneficiary implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "external_id")
    private String externalId;

    @Column(name = "name")
    private String name;

    @Column(name = "is_my_own_iban")
    private Boolean isMyOwnIban;

    @Column(name = "masked_iban")
    private String maskedIBAN;

    @OneToOne
    @JoinColumn(unique = true)
    private Address address;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SEPABeneficiary id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExternalId() {
        return this.externalId;
    }

    public SEPABeneficiary externalId(String externalId) {
        this.setExternalId(externalId);
        return this;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getName() {
        return this.name;
    }

    public SEPABeneficiary name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getIsMyOwnIban() {
        return this.isMyOwnIban;
    }

    public SEPABeneficiary isMyOwnIban(Boolean isMyOwnIban) {
        this.setIsMyOwnIban(isMyOwnIban);
        return this;
    }

    public void setIsMyOwnIban(Boolean isMyOwnIban) {
        this.isMyOwnIban = isMyOwnIban;
    }

    public String getMaskedIBAN() {
        return this.maskedIBAN;
    }

    public SEPABeneficiary maskedIBAN(String maskedIBAN) {
        this.setMaskedIBAN(maskedIBAN);
        return this;
    }

    public void setMaskedIBAN(String maskedIBAN) {
        this.maskedIBAN = maskedIBAN;
    }

    public Address getAddress() {
        return this.address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public SEPABeneficiary address(Address address) {
        this.setAddress(address);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SEPABeneficiary)) {
            return false;
        }
        return id != null && id.equals(((SEPABeneficiary) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SEPABeneficiary{" +
            "id=" + getId() +
            ", externalId='" + getExternalId() + "'" +
            ", name='" + getName() + "'" +
            ", isMyOwnIban='" + getIsMyOwnIban() + "'" +
            ", maskedIBAN='" + getMaskedIBAN() + "'" +
            "}";
    }
}
