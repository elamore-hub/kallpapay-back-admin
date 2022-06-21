import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParticipation } from '../participation.model';

@Component({
  selector: 'jhi-participation-detail',
  templateUrl: './participation-detail.component.html',
})
export class ParticipationDetailComponent implements OnInit {
  participation: IParticipation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ participation }) => {
      this.participation = participation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
