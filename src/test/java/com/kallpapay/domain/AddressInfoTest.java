package com.kallpapay.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.kallpapay.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AddressInfoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AddressInfo.class);
        AddressInfo addressInfo1 = new AddressInfo();
        addressInfo1.setId(1L);
        AddressInfo addressInfo2 = new AddressInfo();
        addressInfo2.setId(addressInfo1.getId());
        assertThat(addressInfo1).isEqualTo(addressInfo2);
        addressInfo2.setId(2L);
        assertThat(addressInfo1).isNotEqualTo(addressInfo2);
        addressInfo1.setId(null);
        assertThat(addressInfo1).isNotEqualTo(addressInfo2);
    }
}
