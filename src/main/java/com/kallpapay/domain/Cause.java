package com.kallpapay.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Cause.
 */
@Entity
@Table(name = "cause")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Cause implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Lob
    @Column(name = "logo")
    private byte[] logo;

    @Column(name = "logo_content_type")
    private String logoContentType;

    @OneToMany(mappedBy = "cause")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "portfolio", "cause" }, allowSetters = true)
    private Set<Category> categories = new HashSet<>();

    @JsonIgnoreProperties(value = { "cause", "donations", "portfolio" }, allowSetters = true)
    @OneToOne(mappedBy = "cause")
    private MyCause myCause;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Cause id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Cause name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Cause description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getLogo() {
        return this.logo;
    }

    public Cause logo(byte[] logo) {
        this.setLogo(logo);
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoContentType() {
        return this.logoContentType;
    }

    public Cause logoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
        return this;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }

    public Set<Category> getCategories() {
        return this.categories;
    }

    public void setCategories(Set<Category> categories) {
        if (this.categories != null) {
            this.categories.forEach(i -> i.setCause(null));
        }
        if (categories != null) {
            categories.forEach(i -> i.setCause(this));
        }
        this.categories = categories;
    }

    public Cause categories(Set<Category> categories) {
        this.setCategories(categories);
        return this;
    }

    public Cause addCategory(Category category) {
        this.categories.add(category);
        category.setCause(this);
        return this;
    }

    public Cause removeCategory(Category category) {
        this.categories.remove(category);
        category.setCause(null);
        return this;
    }

    public MyCause getMyCause() {
        return this.myCause;
    }

    public void setMyCause(MyCause myCause) {
        if (this.myCause != null) {
            this.myCause.setCause(null);
        }
        if (myCause != null) {
            myCause.setCause(this);
        }
        this.myCause = myCause;
    }

    public Cause myCause(MyCause myCause) {
        this.setMyCause(myCause);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cause)) {
            return false;
        }
        return id != null && id.equals(((Cause) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cause{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", logo='" + getLogo() + "'" +
            ", logoContentType='" + getLogoContentType() + "'" +
            "}";
    }
}
