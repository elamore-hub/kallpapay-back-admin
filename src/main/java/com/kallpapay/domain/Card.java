package com.kallpapay.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Card.
 */
@Entity
@Table(name = "card")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Card implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "external_id")
    private String externalId;

    @Column(name = "type")
    private String type;

    @Column(name = "main_currency")
    private String mainCurrency;

    @Column(name = "card_design_url")
    private String cardDesignUrl;

    @Column(name = "card_url")
    private String cardUrl;

    @Column(name = "status")
    private String status;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "card")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "categories", "participations", "myCauses", "card" }, allowSetters = true)
    private Set<Portfolio> portfolios = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "cards", "bankAccount" }, allowSetters = true)
    private AccountMembership accountMembership;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Card id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExternalId() {
        return this.externalId;
    }

    public Card externalId(String externalId) {
        this.setExternalId(externalId);
        return this;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getType() {
        return this.type;
    }

    public Card type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMainCurrency() {
        return this.mainCurrency;
    }

    public Card mainCurrency(String mainCurrency) {
        this.setMainCurrency(mainCurrency);
        return this;
    }

    public void setMainCurrency(String mainCurrency) {
        this.mainCurrency = mainCurrency;
    }

    public String getCardDesignUrl() {
        return this.cardDesignUrl;
    }

    public Card cardDesignUrl(String cardDesignUrl) {
        this.setCardDesignUrl(cardDesignUrl);
        return this;
    }

    public void setCardDesignUrl(String cardDesignUrl) {
        this.cardDesignUrl = cardDesignUrl;
    }

    public String getCardUrl() {
        return this.cardUrl;
    }

    public Card cardUrl(String cardUrl) {
        this.setCardUrl(cardUrl);
        return this;
    }

    public void setCardUrl(String cardUrl) {
        this.cardUrl = cardUrl;
    }

    public String getStatus() {
        return this.status;
    }

    public Card status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getExpiryDate() {
        return this.expiryDate;
    }

    public Card expiryDate(LocalDate expiryDate) {
        this.setExpiryDate(expiryDate);
        return this;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getName() {
        return this.name;
    }

    public Card name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Portfolio> getPortfolios() {
        return this.portfolios;
    }

    public void setPortfolios(Set<Portfolio> portfolios) {
        if (this.portfolios != null) {
            this.portfolios.forEach(i -> i.setCard(null));
        }
        if (portfolios != null) {
            portfolios.forEach(i -> i.setCard(this));
        }
        this.portfolios = portfolios;
    }

    public Card portfolios(Set<Portfolio> portfolios) {
        this.setPortfolios(portfolios);
        return this;
    }

    public Card addPortfolio(Portfolio portfolio) {
        this.portfolios.add(portfolio);
        portfolio.setCard(this);
        return this;
    }

    public Card removePortfolio(Portfolio portfolio) {
        this.portfolios.remove(portfolio);
        portfolio.setCard(null);
        return this;
    }

    public AccountMembership getAccountMembership() {
        return this.accountMembership;
    }

    public void setAccountMembership(AccountMembership accountMembership) {
        this.accountMembership = accountMembership;
    }

    public Card accountMembership(AccountMembership accountMembership) {
        this.setAccountMembership(accountMembership);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Card)) {
            return false;
        }
        return id != null && id.equals(((Card) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Card{" +
            "id=" + getId() +
            ", externalId='" + getExternalId() + "'" +
            ", type='" + getType() + "'" +
            ", mainCurrency='" + getMainCurrency() + "'" +
            ", cardDesignUrl='" + getCardDesignUrl() + "'" +
            ", cardUrl='" + getCardUrl() + "'" +
            ", status='" + getStatus() + "'" +
            ", expiryDate='" + getExpiryDate() + "'" +
            ", name='" + getName() + "'" +
            "}";
    }
}
