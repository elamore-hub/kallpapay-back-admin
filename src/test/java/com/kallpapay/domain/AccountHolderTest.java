package com.kallpapay.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.kallpapay.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AccountHolderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AccountHolder.class);
        AccountHolder accountHolder1 = new AccountHolder();
        accountHolder1.setId(1L);
        AccountHolder accountHolder2 = new AccountHolder();
        accountHolder2.setId(accountHolder1.getId());
        assertThat(accountHolder1).isEqualTo(accountHolder2);
        accountHolder2.setId(2L);
        assertThat(accountHolder1).isNotEqualTo(accountHolder2);
        accountHolder1.setId(null);
        assertThat(accountHolder1).isNotEqualTo(accountHolder2);
    }
}
