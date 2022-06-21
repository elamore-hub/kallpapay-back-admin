package com.kallpapay.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.kallpapay.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SEPABeneficiaryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SEPABeneficiary.class);
        SEPABeneficiary sEPABeneficiary1 = new SEPABeneficiary();
        sEPABeneficiary1.setId(1L);
        SEPABeneficiary sEPABeneficiary2 = new SEPABeneficiary();
        sEPABeneficiary2.setId(sEPABeneficiary1.getId());
        assertThat(sEPABeneficiary1).isEqualTo(sEPABeneficiary2);
        sEPABeneficiary2.setId(2L);
        assertThat(sEPABeneficiary1).isNotEqualTo(sEPABeneficiary2);
        sEPABeneficiary1.setId(null);
        assertThat(sEPABeneficiary1).isNotEqualTo(sEPABeneficiary2);
    }
}
