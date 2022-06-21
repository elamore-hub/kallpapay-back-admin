package com.kallpapay.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kallpapay.domain.enumeration.Method;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Portfolio.
 */
@Entity
@Table(name = "portfolio")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Portfolio implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "limit_amount")
    private Long limitAmount;

    @Column(name = "amount")
    private Long amount;

    @Column(name = "limit_percentage")
    private Long limitPercentage;

    @Column(name = "percentage")
    private Long percentage;

    @Enumerated(EnumType.STRING)
    @Column(name = "method")
    private Method method;

    @OneToMany(mappedBy = "portfolio")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "portfolio", "cause" }, allowSetters = true)
    private Set<Category> categories = new HashSet<>();

    @OneToMany(mappedBy = "portfolio")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "amount", "portfolio" }, allowSetters = true)
    private Set<Participation> participations = new HashSet<>();

    @OneToMany(mappedBy = "portfolio")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "cause", "donations", "portfolio" }, allowSetters = true)
    private Set<MyCause> myCauses = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "portfolios", "accountMembership" }, allowSetters = true)
    private Card card;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Portfolio id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLimitAmount() {
        return this.limitAmount;
    }

    public Portfolio limitAmount(Long limitAmount) {
        this.setLimitAmount(limitAmount);
        return this;
    }

    public void setLimitAmount(Long limitAmount) {
        this.limitAmount = limitAmount;
    }

    public Long getAmount() {
        return this.amount;
    }

    public Portfolio amount(Long amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public Long getLimitPercentage() {
        return this.limitPercentage;
    }

    public Portfolio limitPercentage(Long limitPercentage) {
        this.setLimitPercentage(limitPercentage);
        return this;
    }

    public void setLimitPercentage(Long limitPercentage) {
        this.limitPercentage = limitPercentage;
    }

    public Long getPercentage() {
        return this.percentage;
    }

    public Portfolio percentage(Long percentage) {
        this.setPercentage(percentage);
        return this;
    }

    public void setPercentage(Long percentage) {
        this.percentage = percentage;
    }

    public Method getMethod() {
        return this.method;
    }

    public Portfolio method(Method method) {
        this.setMethod(method);
        return this;
    }

    public void setMethod(Method method) {
        this.method = method;
    }

    public Set<Category> getCategories() {
        return this.categories;
    }

    public void setCategories(Set<Category> categories) {
        if (this.categories != null) {
            this.categories.forEach(i -> i.setPortfolio(null));
        }
        if (categories != null) {
            categories.forEach(i -> i.setPortfolio(this));
        }
        this.categories = categories;
    }

    public Portfolio categories(Set<Category> categories) {
        this.setCategories(categories);
        return this;
    }

    public Portfolio addCategory(Category category) {
        this.categories.add(category);
        category.setPortfolio(this);
        return this;
    }

    public Portfolio removeCategory(Category category) {
        this.categories.remove(category);
        category.setPortfolio(null);
        return this;
    }

    public Set<Participation> getParticipations() {
        return this.participations;
    }

    public void setParticipations(Set<Participation> participations) {
        if (this.participations != null) {
            this.participations.forEach(i -> i.setPortfolio(null));
        }
        if (participations != null) {
            participations.forEach(i -> i.setPortfolio(this));
        }
        this.participations = participations;
    }

    public Portfolio participations(Set<Participation> participations) {
        this.setParticipations(participations);
        return this;
    }

    public Portfolio addParticipation(Participation participation) {
        this.participations.add(participation);
        participation.setPortfolio(this);
        return this;
    }

    public Portfolio removeParticipation(Participation participation) {
        this.participations.remove(participation);
        participation.setPortfolio(null);
        return this;
    }

    public Set<MyCause> getMyCauses() {
        return this.myCauses;
    }

    public void setMyCauses(Set<MyCause> myCauses) {
        if (this.myCauses != null) {
            this.myCauses.forEach(i -> i.setPortfolio(null));
        }
        if (myCauses != null) {
            myCauses.forEach(i -> i.setPortfolio(this));
        }
        this.myCauses = myCauses;
    }

    public Portfolio myCauses(Set<MyCause> myCauses) {
        this.setMyCauses(myCauses);
        return this;
    }

    public Portfolio addMyCause(MyCause myCause) {
        this.myCauses.add(myCause);
        myCause.setPortfolio(this);
        return this;
    }

    public Portfolio removeMyCause(MyCause myCause) {
        this.myCauses.remove(myCause);
        myCause.setPortfolio(null);
        return this;
    }

    public Card getCard() {
        return this.card;
    }

    public void setCard(Card card) {
        this.card = card;
    }

    public Portfolio card(Card card) {
        this.setCard(card);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Portfolio)) {
            return false;
        }
        return id != null && id.equals(((Portfolio) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Portfolio{" +
            "id=" + getId() +
            ", limitAmount=" + getLimitAmount() +
            ", amount=" + getAmount() +
            ", limitPercentage=" + getLimitPercentage() +
            ", percentage=" + getPercentage() +
            ", method='" + getMethod() + "'" +
            "}";
    }
}
