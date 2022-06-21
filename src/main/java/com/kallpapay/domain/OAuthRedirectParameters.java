package com.kallpapay.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A OAuthRedirectParameters.
 */
@Entity
@Table(name = "o_auth_redirect_parameters")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class OAuthRedirectParameters implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "state")
    private String state;

    @Column(name = "redirect_url")
    private String redirectUrl;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OAuthRedirectParameters id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getState() {
        return this.state;
    }

    public OAuthRedirectParameters state(String state) {
        this.setState(state);
        return this;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getRedirectUrl() {
        return this.redirectUrl;
    }

    public OAuthRedirectParameters redirectUrl(String redirectUrl) {
        this.setRedirectUrl(redirectUrl);
        return this;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OAuthRedirectParameters)) {
            return false;
        }
        return id != null && id.equals(((OAuthRedirectParameters) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OAuthRedirectParameters{" +
            "id=" + getId() +
            ", state='" + getState() + "'" +
            ", redirectUrl='" + getRedirectUrl() + "'" +
            "}";
    }
}
