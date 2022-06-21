import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICause } from '../cause.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-cause-detail',
  templateUrl: './cause-detail.component.html',
})
export class CauseDetailComponent implements OnInit {
  cause: ICause | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cause }) => {
      this.cause = cause;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
