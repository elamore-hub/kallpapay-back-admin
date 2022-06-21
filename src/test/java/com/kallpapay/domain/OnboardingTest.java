package com.kallpapay.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.kallpapay.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OnboardingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Onboarding.class);
        Onboarding onboarding1 = new Onboarding();
        onboarding1.setId(1L);
        Onboarding onboarding2 = new Onboarding();
        onboarding2.setId(onboarding1.getId());
        assertThat(onboarding1).isEqualTo(onboarding2);
        onboarding2.setId(2L);
        assertThat(onboarding1).isNotEqualTo(onboarding2);
        onboarding1.setId(null);
        assertThat(onboarding1).isNotEqualTo(onboarding2);
    }
}
