import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMyCause } from '../my-cause.model';

@Component({
  selector: 'jhi-my-cause-detail',
  templateUrl: './my-cause-detail.component.html',
})
export class MyCauseDetailComponent implements OnInit {
  myCause: IMyCause | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ myCause }) => {
      this.myCause = myCause;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
