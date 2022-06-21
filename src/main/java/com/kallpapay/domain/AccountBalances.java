package com.kallpapay.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AccountBalances.
 */
@Entity
@Table(name = "account_balances")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AccountBalances implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne
    @JoinColumn(unique = true)
    private Amount available;

    @OneToOne
    @JoinColumn(unique = true)
    private Amount booked;

    @OneToOne
    @JoinColumn(unique = true)
    private Amount pending;

    @OneToOne
    @JoinColumn(unique = true)
    private Amount reserved;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AccountBalances id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Amount getAvailable() {
        return this.available;
    }

    public void setAvailable(Amount amount) {
        this.available = amount;
    }

    public AccountBalances available(Amount amount) {
        this.setAvailable(amount);
        return this;
    }

    public Amount getBooked() {
        return this.booked;
    }

    public void setBooked(Amount amount) {
        this.booked = amount;
    }

    public AccountBalances booked(Amount amount) {
        this.setBooked(amount);
        return this;
    }

    public Amount getPending() {
        return this.pending;
    }

    public void setPending(Amount amount) {
        this.pending = amount;
    }

    public AccountBalances pending(Amount amount) {
        this.setPending(amount);
        return this;
    }

    public Amount getReserved() {
        return this.reserved;
    }

    public void setReserved(Amount amount) {
        this.reserved = amount;
    }

    public AccountBalances reserved(Amount amount) {
        this.setReserved(amount);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AccountBalances)) {
            return false;
        }
        return id != null && id.equals(((AccountBalances) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AccountBalances{" +
            "id=" + getId() +
            "}";
    }
}
