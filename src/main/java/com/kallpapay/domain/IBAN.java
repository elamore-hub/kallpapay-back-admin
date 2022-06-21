package com.kallpapay.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A IBAN.
 */
@Entity
@Table(name = "iban")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class IBAN implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "iban")
    private String iban;

    @Column(name = "bic")
    private String bic;

    @Column(name = "account_owner")
    private String accountOwner;

    @OneToMany(mappedBy = "iBAN")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "amount", "bankAccount", "iBAN", "payment" }, allowSetters = true)
    private Set<Transaction> transactions = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "balances", "accountMemberships", "iBANS", "transactions", "accountHolder" }, allowSetters = true)
    private BankAccount bankAccount;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public IBAN id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public IBAN name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIban() {
        return this.iban;
    }

    public IBAN iban(String iban) {
        this.setIban(iban);
        return this;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

    public String getBic() {
        return this.bic;
    }

    public IBAN bic(String bic) {
        this.setBic(bic);
        return this;
    }

    public void setBic(String bic) {
        this.bic = bic;
    }

    public String getAccountOwner() {
        return this.accountOwner;
    }

    public IBAN accountOwner(String accountOwner) {
        this.setAccountOwner(accountOwner);
        return this;
    }

    public void setAccountOwner(String accountOwner) {
        this.accountOwner = accountOwner;
    }

    public Set<Transaction> getTransactions() {
        return this.transactions;
    }

    public void setTransactions(Set<Transaction> transactions) {
        if (this.transactions != null) {
            this.transactions.forEach(i -> i.setIBAN(null));
        }
        if (transactions != null) {
            transactions.forEach(i -> i.setIBAN(this));
        }
        this.transactions = transactions;
    }

    public IBAN transactions(Set<Transaction> transactions) {
        this.setTransactions(transactions);
        return this;
    }

    public IBAN addTransaction(Transaction transaction) {
        this.transactions.add(transaction);
        transaction.setIBAN(this);
        return this;
    }

    public IBAN removeTransaction(Transaction transaction) {
        this.transactions.remove(transaction);
        transaction.setIBAN(null);
        return this;
    }

    public BankAccount getBankAccount() {
        return this.bankAccount;
    }

    public void setBankAccount(BankAccount bankAccount) {
        this.bankAccount = bankAccount;
    }

    public IBAN bankAccount(BankAccount bankAccount) {
        this.setBankAccount(bankAccount);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof IBAN)) {
            return false;
        }
        return id != null && id.equals(((IBAN) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "IBAN{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", iban='" + getIban() + "'" +
            ", bic='" + getBic() + "'" +
            ", accountOwner='" + getAccountOwner() + "'" +
            "}";
    }
}
