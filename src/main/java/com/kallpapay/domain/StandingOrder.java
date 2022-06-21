package com.kallpapay.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A StandingOrder.
 */
@Entity
@Table(name = "standing_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class StandingOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "external_id")
    private String externalId;

    @Column(name = "reference")
    private String reference;

    @Column(name = "label")
    private String label;

    @Column(name = "status")
    private String status;

    @OneToOne
    @JoinColumn(unique = true)
    private Amount amount;

    @JsonIgnoreProperties(value = { "address" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private SEPABeneficiary sepaBeneficiary;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public StandingOrder id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExternalId() {
        return this.externalId;
    }

    public StandingOrder externalId(String externalId) {
        this.setExternalId(externalId);
        return this;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getReference() {
        return this.reference;
    }

    public StandingOrder reference(String reference) {
        this.setReference(reference);
        return this;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getLabel() {
        return this.label;
    }

    public StandingOrder label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getStatus() {
        return this.status;
    }

    public StandingOrder status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Amount getAmount() {
        return this.amount;
    }

    public void setAmount(Amount amount) {
        this.amount = amount;
    }

    public StandingOrder amount(Amount amount) {
        this.setAmount(amount);
        return this;
    }

    public SEPABeneficiary getSepaBeneficiary() {
        return this.sepaBeneficiary;
    }

    public void setSepaBeneficiary(SEPABeneficiary sEPABeneficiary) {
        this.sepaBeneficiary = sEPABeneficiary;
    }

    public StandingOrder sepaBeneficiary(SEPABeneficiary sEPABeneficiary) {
        this.setSepaBeneficiary(sEPABeneficiary);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StandingOrder)) {
            return false;
        }
        return id != null && id.equals(((StandingOrder) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StandingOrder{" +
            "id=" + getId() +
            ", externalId='" + getExternalId() + "'" +
            ", reference='" + getReference() + "'" +
            ", label='" + getLabel() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
