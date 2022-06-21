package com.kallpapay.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.kallpapay.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CauseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cause.class);
        Cause cause1 = new Cause();
        cause1.setId(1L);
        Cause cause2 = new Cause();
        cause2.setId(cause1.getId());
        assertThat(cause1).isEqualTo(cause2);
        cause2.setId(2L);
        assertThat(cause1).isNotEqualTo(cause2);
        cause1.setId(null);
        assertThat(cause1).isNotEqualTo(cause2);
    }
}
