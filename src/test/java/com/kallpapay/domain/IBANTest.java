package com.kallpapay.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.kallpapay.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class IBANTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(IBAN.class);
        IBAN iBAN1 = new IBAN();
        iBAN1.setId(1L);
        IBAN iBAN2 = new IBAN();
        iBAN2.setId(iBAN1.getId());
        assertThat(iBAN1).isEqualTo(iBAN2);
        iBAN2.setId(2L);
        assertThat(iBAN1).isNotEqualTo(iBAN2);
        iBAN1.setId(null);
        assertThat(iBAN1).isNotEqualTo(iBAN2);
    }
}
