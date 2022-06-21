import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICause } from '../cause.model';
import { CauseService } from '../service/cause.service';
import { CauseDeleteDialogComponent } from '../delete/cause-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-cause',
  templateUrl: './cause.component.html',
})
export class CauseComponent implements OnInit {
  causes?: ICause[];
  isLoading = false;

  constructor(protected causeService: CauseService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.causeService.query().subscribe({
      next: (res: HttpResponse<ICause[]>) => {
        this.isLoading = false;
        this.causes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ICause): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(cause: ICause): void {
    const modalRef = this.modalService.open(CauseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cause = cause;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
