package com.kallpapay.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Transaction.
 */
@Entity
@Table(name = "transaction")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Transaction implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "external_id")
    private String externalId;

    @Column(name = "reference")
    private String reference;

    @Column(name = "payment_method_identifier")
    private String paymentMethodIdentifier;

    @Column(name = "side")
    private String side;

    @Column(name = "type")
    private String type;

    @Column(name = "label")
    private String label;

    @Column(name = "status")
    private String status;

    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = "counterparty")
    private String counterparty;

    @Column(name = "payment_product")
    private String paymentProduct;

    @Column(name = "external_reference")
    private String externalReference;

    @OneToOne
    @JoinColumn(unique = true)
    private Amount amount;

    @ManyToOne
    @JsonIgnoreProperties(value = { "balances", "accountMemberships", "iBANS", "transactions", "accountHolder" }, allowSetters = true)
    private BankAccount bankAccount;

    @ManyToOne
    @JsonIgnoreProperties(value = { "transactions", "bankAccount" }, allowSetters = true)
    private IBAN iBAN;

    @ManyToOne
    @JsonIgnoreProperties(value = { "standingOrder", "transactions" }, allowSetters = true)
    private Payment payment;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Transaction id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExternalId() {
        return this.externalId;
    }

    public Transaction externalId(String externalId) {
        this.setExternalId(externalId);
        return this;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getReference() {
        return this.reference;
    }

    public Transaction reference(String reference) {
        this.setReference(reference);
        return this;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getPaymentMethodIdentifier() {
        return this.paymentMethodIdentifier;
    }

    public Transaction paymentMethodIdentifier(String paymentMethodIdentifier) {
        this.setPaymentMethodIdentifier(paymentMethodIdentifier);
        return this;
    }

    public void setPaymentMethodIdentifier(String paymentMethodIdentifier) {
        this.paymentMethodIdentifier = paymentMethodIdentifier;
    }

    public String getSide() {
        return this.side;
    }

    public Transaction side(String side) {
        this.setSide(side);
        return this;
    }

    public void setSide(String side) {
        this.side = side;
    }

    public String getType() {
        return this.type;
    }

    public Transaction type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLabel() {
        return this.label;
    }

    public Transaction label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getStatus() {
        return this.status;
    }

    public Transaction status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentId() {
        return this.paymentId;
    }

    public Transaction paymentId(String paymentId) {
        this.setPaymentId(paymentId);
        return this;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getCounterparty() {
        return this.counterparty;
    }

    public Transaction counterparty(String counterparty) {
        this.setCounterparty(counterparty);
        return this;
    }

    public void setCounterparty(String counterparty) {
        this.counterparty = counterparty;
    }

    public String getPaymentProduct() {
        return this.paymentProduct;
    }

    public Transaction paymentProduct(String paymentProduct) {
        this.setPaymentProduct(paymentProduct);
        return this;
    }

    public void setPaymentProduct(String paymentProduct) {
        this.paymentProduct = paymentProduct;
    }

    public String getExternalReference() {
        return this.externalReference;
    }

    public Transaction externalReference(String externalReference) {
        this.setExternalReference(externalReference);
        return this;
    }

    public void setExternalReference(String externalReference) {
        this.externalReference = externalReference;
    }

    public Amount getAmount() {
        return this.amount;
    }

    public void setAmount(Amount amount) {
        this.amount = amount;
    }

    public Transaction amount(Amount amount) {
        this.setAmount(amount);
        return this;
    }

    public BankAccount getBankAccount() {
        return this.bankAccount;
    }

    public void setBankAccount(BankAccount bankAccount) {
        this.bankAccount = bankAccount;
    }

    public Transaction bankAccount(BankAccount bankAccount) {
        this.setBankAccount(bankAccount);
        return this;
    }

    public IBAN getIBAN() {
        return this.iBAN;
    }

    public void setIBAN(IBAN iBAN) {
        this.iBAN = iBAN;
    }

    public Transaction iBAN(IBAN iBAN) {
        this.setIBAN(iBAN);
        return this;
    }

    public Payment getPayment() {
        return this.payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public Transaction payment(Payment payment) {
        this.setPayment(payment);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Transaction)) {
            return false;
        }
        return id != null && id.equals(((Transaction) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Transaction{" +
            "id=" + getId() +
            ", externalId='" + getExternalId() + "'" +
            ", reference='" + getReference() + "'" +
            ", paymentMethodIdentifier='" + getPaymentMethodIdentifier() + "'" +
            ", side='" + getSide() + "'" +
            ", type='" + getType() + "'" +
            ", label='" + getLabel() + "'" +
            ", status='" + getStatus() + "'" +
            ", paymentId='" + getPaymentId() + "'" +
            ", counterparty='" + getCounterparty() + "'" +
            ", paymentProduct='" + getPaymentProduct() + "'" +
            ", externalReference='" + getExternalReference() + "'" +
            "}";
    }
}
