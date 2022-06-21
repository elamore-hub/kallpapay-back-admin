import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOAuthRedirectParameters } from '../o-auth-redirect-parameters.model';

@Component({
  selector: 'jhi-o-auth-redirect-parameters-detail',
  templateUrl: './o-auth-redirect-parameters-detail.component.html',
})
export class OAuthRedirectParametersDetailComponent implements OnInit {
  oAuthRedirectParameters: IOAuthRedirectParameters | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ oAuthRedirectParameters }) => {
      this.oAuthRedirectParameters = oAuthRedirectParameters;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
