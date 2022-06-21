package com.kallpapay.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BankAccount.
 */
@Entity
@Table(name = "bank_account")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class BankAccount implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "external_id")
    private String externalId;

    @Column(name = "number")
    private String number;

    @Column(name = "name")
    private String name;

    @Column(name = "currency")
    private String currency;

    @Column(name = "status")
    private String status;

    @Column(name = "language")
    private String language;

    @JsonIgnoreProperties(value = { "available", "booked", "pending", "reserved" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private AccountBalances balances;

    @OneToMany(mappedBy = "bankAccount")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "cards", "bankAccount" }, allowSetters = true)
    private Set<AccountMembership> accountMemberships = new HashSet<>();

    @OneToMany(mappedBy = "bankAccount")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "transactions", "bankAccount" }, allowSetters = true)
    private Set<IBAN> iBANS = new HashSet<>();

    @OneToMany(mappedBy = "bankAccount")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "amount", "bankAccount", "iBAN", "payment" }, allowSetters = true)
    private Set<Transaction> transactions = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "accountHolderInfo", "residencyAddress", "bankAccounts", "supportingDocuments", "onboarding" },
        allowSetters = true
    )
    private AccountHolder accountHolder;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BankAccount id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExternalId() {
        return this.externalId;
    }

    public BankAccount externalId(String externalId) {
        this.setExternalId(externalId);
        return this;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getNumber() {
        return this.number;
    }

    public BankAccount number(String number) {
        this.setNumber(number);
        return this;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getName() {
        return this.name;
    }

    public BankAccount name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCurrency() {
        return this.currency;
    }

    public BankAccount currency(String currency) {
        this.setCurrency(currency);
        return this;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getStatus() {
        return this.status;
    }

    public BankAccount status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLanguage() {
        return this.language;
    }

    public BankAccount language(String language) {
        this.setLanguage(language);
        return this;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public AccountBalances getBalances() {
        return this.balances;
    }

    public void setBalances(AccountBalances accountBalances) {
        this.balances = accountBalances;
    }

    public BankAccount balances(AccountBalances accountBalances) {
        this.setBalances(accountBalances);
        return this;
    }

    public Set<AccountMembership> getAccountMemberships() {
        return this.accountMemberships;
    }

    public void setAccountMemberships(Set<AccountMembership> accountMemberships) {
        if (this.accountMemberships != null) {
            this.accountMemberships.forEach(i -> i.setBankAccount(null));
        }
        if (accountMemberships != null) {
            accountMemberships.forEach(i -> i.setBankAccount(this));
        }
        this.accountMemberships = accountMemberships;
    }

    public BankAccount accountMemberships(Set<AccountMembership> accountMemberships) {
        this.setAccountMemberships(accountMemberships);
        return this;
    }

    public BankAccount addAccountMembership(AccountMembership accountMembership) {
        this.accountMemberships.add(accountMembership);
        accountMembership.setBankAccount(this);
        return this;
    }

    public BankAccount removeAccountMembership(AccountMembership accountMembership) {
        this.accountMemberships.remove(accountMembership);
        accountMembership.setBankAccount(null);
        return this;
    }

    public Set<IBAN> getIBANS() {
        return this.iBANS;
    }

    public void setIBANS(Set<IBAN> iBANS) {
        if (this.iBANS != null) {
            this.iBANS.forEach(i -> i.setBankAccount(null));
        }
        if (iBANS != null) {
            iBANS.forEach(i -> i.setBankAccount(this));
        }
        this.iBANS = iBANS;
    }

    public BankAccount iBANS(Set<IBAN> iBANS) {
        this.setIBANS(iBANS);
        return this;
    }

    public BankAccount addIBAN(IBAN iBAN) {
        this.iBANS.add(iBAN);
        iBAN.setBankAccount(this);
        return this;
    }

    public BankAccount removeIBAN(IBAN iBAN) {
        this.iBANS.remove(iBAN);
        iBAN.setBankAccount(null);
        return this;
    }

    public Set<Transaction> getTransactions() {
        return this.transactions;
    }

    public void setTransactions(Set<Transaction> transactions) {
        if (this.transactions != null) {
            this.transactions.forEach(i -> i.setBankAccount(null));
        }
        if (transactions != null) {
            transactions.forEach(i -> i.setBankAccount(this));
        }
        this.transactions = transactions;
    }

    public BankAccount transactions(Set<Transaction> transactions) {
        this.setTransactions(transactions);
        return this;
    }

    public BankAccount addTransaction(Transaction transaction) {
        this.transactions.add(transaction);
        transaction.setBankAccount(this);
        return this;
    }

    public BankAccount removeTransaction(Transaction transaction) {
        this.transactions.remove(transaction);
        transaction.setBankAccount(null);
        return this;
    }

    public AccountHolder getAccountHolder() {
        return this.accountHolder;
    }

    public void setAccountHolder(AccountHolder accountHolder) {
        this.accountHolder = accountHolder;
    }

    public BankAccount accountHolder(AccountHolder accountHolder) {
        this.setAccountHolder(accountHolder);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BankAccount)) {
            return false;
        }
        return id != null && id.equals(((BankAccount) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BankAccount{" +
            "id=" + getId() +
            ", externalId='" + getExternalId() + "'" +
            ", number='" + getNumber() + "'" +
            ", name='" + getName() + "'" +
            ", currency='" + getCurrency() + "'" +
            ", status='" + getStatus() + "'" +
            ", language='" + getLanguage() + "'" +
            "}";
    }
}
