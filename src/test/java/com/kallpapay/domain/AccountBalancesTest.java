package com.kallpapay.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.kallpapay.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AccountBalancesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AccountBalances.class);
        AccountBalances accountBalances1 = new AccountBalances();
        accountBalances1.setId(1L);
        AccountBalances accountBalances2 = new AccountBalances();
        accountBalances2.setId(accountBalances1.getId());
        assertThat(accountBalances1).isEqualTo(accountBalances2);
        accountBalances2.setId(2L);
        assertThat(accountBalances1).isNotEqualTo(accountBalances2);
        accountBalances1.setId(null);
        assertThat(accountBalances1).isNotEqualTo(accountBalances2);
    }
}
