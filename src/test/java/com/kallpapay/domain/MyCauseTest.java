package com.kallpapay.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.kallpapay.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MyCauseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MyCause.class);
        MyCause myCause1 = new MyCause();
        myCause1.setId(1L);
        MyCause myCause2 = new MyCause();
        myCause2.setId(myCause1.getId());
        assertThat(myCause1).isEqualTo(myCause2);
        myCause2.setId(2L);
        assertThat(myCause1).isNotEqualTo(myCause2);
        myCause1.setId(null);
        assertThat(myCause1).isNotEqualTo(myCause2);
    }
}
