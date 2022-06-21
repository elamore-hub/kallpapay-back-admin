package com.kallpapay.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.kallpapay.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AccountMembershipTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AccountMembership.class);
        AccountMembership accountMembership1 = new AccountMembership();
        accountMembership1.setId(1L);
        AccountMembership accountMembership2 = new AccountMembership();
        accountMembership2.setId(accountMembership1.getId());
        assertThat(accountMembership1).isEqualTo(accountMembership2);
        accountMembership2.setId(2L);
        assertThat(accountMembership1).isNotEqualTo(accountMembership2);
        accountMembership1.setId(null);
        assertThat(accountMembership1).isNotEqualTo(accountMembership2);
    }
}
