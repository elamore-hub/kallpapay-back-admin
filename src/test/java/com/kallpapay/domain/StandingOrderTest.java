package com.kallpapay.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.kallpapay.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StandingOrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StandingOrder.class);
        StandingOrder standingOrder1 = new StandingOrder();
        standingOrder1.setId(1L);
        StandingOrder standingOrder2 = new StandingOrder();
        standingOrder2.setId(standingOrder1.getId());
        assertThat(standingOrder1).isEqualTo(standingOrder2);
        standingOrder2.setId(2L);
        assertThat(standingOrder1).isNotEqualTo(standingOrder2);
        standingOrder1.setId(null);
        assertThat(standingOrder1).isNotEqualTo(standingOrder2);
    }
}
