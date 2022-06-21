import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOnboarding } from '../onboarding.model';

@Component({
  selector: 'jhi-onboarding-detail',
  templateUrl: './onboarding-detail.component.html',
})
export class OnboardingDetailComponent implements OnInit {
  onboarding: IOnboarding | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ onboarding }) => {
      this.onboarding = onboarding;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
