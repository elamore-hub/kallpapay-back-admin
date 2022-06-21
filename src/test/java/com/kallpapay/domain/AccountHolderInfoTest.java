package com.kallpapay.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.kallpapay.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AccountHolderInfoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AccountHolderInfo.class);
        AccountHolderInfo accountHolderInfo1 = new AccountHolderInfo();
        accountHolderInfo1.setId(1L);
        AccountHolderInfo accountHolderInfo2 = new AccountHolderInfo();
        accountHolderInfo2.setId(accountHolderInfo1.getId());
        assertThat(accountHolderInfo1).isEqualTo(accountHolderInfo2);
        accountHolderInfo2.setId(2L);
        assertThat(accountHolderInfo1).isNotEqualTo(accountHolderInfo2);
        accountHolderInfo1.setId(null);
        assertThat(accountHolderInfo1).isNotEqualTo(accountHolderInfo2);
    }
}
