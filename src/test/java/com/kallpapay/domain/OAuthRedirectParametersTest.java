package com.kallpapay.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.kallpapay.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OAuthRedirectParametersTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OAuthRedirectParameters.class);
        OAuthRedirectParameters oAuthRedirectParameters1 = new OAuthRedirectParameters();
        oAuthRedirectParameters1.setId(1L);
        OAuthRedirectParameters oAuthRedirectParameters2 = new OAuthRedirectParameters();
        oAuthRedirectParameters2.setId(oAuthRedirectParameters1.getId());
        assertThat(oAuthRedirectParameters1).isEqualTo(oAuthRedirectParameters2);
        oAuthRedirectParameters2.setId(2L);
        assertThat(oAuthRedirectParameters1).isNotEqualTo(oAuthRedirectParameters2);
        oAuthRedirectParameters1.setId(null);
        assertThat(oAuthRedirectParameters1).isNotEqualTo(oAuthRedirectParameters2);
    }
}
