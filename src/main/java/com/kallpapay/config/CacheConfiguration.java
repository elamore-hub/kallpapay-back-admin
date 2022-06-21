package com.kallpapay.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.kallpapay.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.kallpapay.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.kallpapay.domain.User.class.getName());
            createCache(cm, com.kallpapay.domain.Authority.class.getName());
            createCache(cm, com.kallpapay.domain.User.class.getName() + ".authorities");
            createCache(cm, com.kallpapay.domain.AccountHolderInfo.class.getName());
            createCache(cm, com.kallpapay.domain.AddressInfo.class.getName());
            createCache(cm, com.kallpapay.domain.AccountHolder.class.getName());
            createCache(cm, com.kallpapay.domain.AccountHolder.class.getName() + ".bankAccounts");
            createCache(cm, com.kallpapay.domain.AccountHolder.class.getName() + ".supportingDocuments");
            createCache(cm, com.kallpapay.domain.AccountMembership.class.getName());
            createCache(cm, com.kallpapay.domain.AccountMembership.class.getName() + ".cards");
            createCache(cm, com.kallpapay.domain.Amount.class.getName());
            createCache(cm, com.kallpapay.domain.BankAccount.class.getName());
            createCache(cm, com.kallpapay.domain.BankAccount.class.getName() + ".accountMemberships");
            createCache(cm, com.kallpapay.domain.BankAccount.class.getName() + ".iBANS");
            createCache(cm, com.kallpapay.domain.BankAccount.class.getName() + ".transactions");
            createCache(cm, com.kallpapay.domain.AccountBalances.class.getName());
            createCache(cm, com.kallpapay.domain.Card.class.getName());
            createCache(cm, com.kallpapay.domain.Card.class.getName() + ".portfolios");
            createCache(cm, com.kallpapay.domain.IBAN.class.getName());
            createCache(cm, com.kallpapay.domain.IBAN.class.getName() + ".transactions");
            createCache(cm, com.kallpapay.domain.Payment.class.getName());
            createCache(cm, com.kallpapay.domain.Payment.class.getName() + ".transactions");
            createCache(cm, com.kallpapay.domain.StandingOrder.class.getName());
            createCache(cm, com.kallpapay.domain.SEPABeneficiary.class.getName());
            createCache(cm, com.kallpapay.domain.Address.class.getName());
            createCache(cm, com.kallpapay.domain.Transaction.class.getName());
            createCache(cm, com.kallpapay.domain.Onboarding.class.getName());
            createCache(cm, com.kallpapay.domain.Onboarding.class.getName() + ".supportingDocuments");
            createCache(cm, com.kallpapay.domain.OAuthRedirectParameters.class.getName());
            createCache(cm, com.kallpapay.domain.SupportingDocument.class.getName());
            createCache(cm, com.kallpapay.domain.Portfolio.class.getName());
            createCache(cm, com.kallpapay.domain.Portfolio.class.getName() + ".categories");
            createCache(cm, com.kallpapay.domain.Portfolio.class.getName() + ".participations");
            createCache(cm, com.kallpapay.domain.Portfolio.class.getName() + ".myCauses");
            createCache(cm, com.kallpapay.domain.Category.class.getName());
            createCache(cm, com.kallpapay.domain.Cause.class.getName());
            createCache(cm, com.kallpapay.domain.Cause.class.getName() + ".categories");
            createCache(cm, com.kallpapay.domain.MyCause.class.getName());
            createCache(cm, com.kallpapay.domain.MyCause.class.getName() + ".donations");
            createCache(cm, com.kallpapay.domain.Donation.class.getName());
            createCache(cm, com.kallpapay.domain.Participation.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
