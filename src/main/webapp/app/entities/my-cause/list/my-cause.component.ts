import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMyCause } from '../my-cause.model';
import { MyCauseService } from '../service/my-cause.service';
import { MyCauseDeleteDialogComponent } from '../delete/my-cause-delete-dialog.component';

@Component({
  selector: 'jhi-my-cause',
  templateUrl: './my-cause.component.html',
})
export class MyCauseComponent implements OnInit {
  myCauses?: IMyCause[];
  isLoading = false;

  constructor(protected myCauseService: MyCauseService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.myCauseService.query().subscribe({
      next: (res: HttpResponse<IMyCause[]>) => {
        this.isLoading = false;
        this.myCauses = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IMyCause): number {
    return item.id!;
  }

  delete(myCause: IMyCause): void {
    const modalRef = this.modalService.open(MyCauseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.myCause = myCause;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
