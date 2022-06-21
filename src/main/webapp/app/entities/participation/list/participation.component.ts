import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IParticipation } from '../participation.model';
import { ParticipationService } from '../service/participation.service';
import { ParticipationDeleteDialogComponent } from '../delete/participation-delete-dialog.component';

@Component({
  selector: 'jhi-participation',
  templateUrl: './participation.component.html',
})
export class ParticipationComponent implements OnInit {
  participations?: IParticipation[];
  isLoading = false;

  constructor(protected participationService: ParticipationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.participationService.query().subscribe({
      next: (res: HttpResponse<IParticipation[]>) => {
        this.isLoading = false;
        this.participations = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IParticipation): number {
    return item.id!;
  }

  delete(participation: IParticipation): void {
    const modalRef = this.modalService.open(ParticipationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.participation = participation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
