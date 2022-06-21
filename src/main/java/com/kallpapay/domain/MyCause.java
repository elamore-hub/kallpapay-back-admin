package com.kallpapay.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A MyCause.
 */
@Entity
@Table(name = "my_cause")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class MyCause implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "percentage")
    private Long percentage;

    @JsonIgnoreProperties(value = { "categories", "myCause" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Cause cause;

    @OneToMany(mappedBy = "myCause")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "myCause" }, allowSetters = true)
    private Set<Donation> donations = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "categories", "participations", "myCauses", "card" }, allowSetters = true)
    private Portfolio portfolio;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public MyCause id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPercentage() {
        return this.percentage;
    }

    public MyCause percentage(Long percentage) {
        this.setPercentage(percentage);
        return this;
    }

    public void setPercentage(Long percentage) {
        this.percentage = percentage;
    }

    public Cause getCause() {
        return this.cause;
    }

    public void setCause(Cause cause) {
        this.cause = cause;
    }

    public MyCause cause(Cause cause) {
        this.setCause(cause);
        return this;
    }

    public Set<Donation> getDonations() {
        return this.donations;
    }

    public void setDonations(Set<Donation> donations) {
        if (this.donations != null) {
            this.donations.forEach(i -> i.setMyCause(null));
        }
        if (donations != null) {
            donations.forEach(i -> i.setMyCause(this));
        }
        this.donations = donations;
    }

    public MyCause donations(Set<Donation> donations) {
        this.setDonations(donations);
        return this;
    }

    public MyCause addDonation(Donation donation) {
        this.donations.add(donation);
        donation.setMyCause(this);
        return this;
    }

    public MyCause removeDonation(Donation donation) {
        this.donations.remove(donation);
        donation.setMyCause(null);
        return this;
    }

    public Portfolio getPortfolio() {
        return this.portfolio;
    }

    public void setPortfolio(Portfolio portfolio) {
        this.portfolio = portfolio;
    }

    public MyCause portfolio(Portfolio portfolio) {
        this.setPortfolio(portfolio);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MyCause)) {
            return false;
        }
        return id != null && id.equals(((MyCause) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MyCause{" +
            "id=" + getId() +
            ", percentage=" + getPercentage() +
            "}";
    }
}
