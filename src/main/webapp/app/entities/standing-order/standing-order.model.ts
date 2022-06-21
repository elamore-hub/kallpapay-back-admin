import { IAmount } from 'app/entities/amount/amount.model';
import { ISEPABeneficiary } from 'app/entities/sepa-beneficiary/sepa-beneficiary.model';

export interface IStandingOrder {
  id?: number;
  externalId?: string | null;
  reference?: string | null;
  label?: string | null;
  status?: string | null;
  amount?: IAmount | null;
  sepaBeneficiary?: ISEPABeneficiary | null;
}

export class StandingOrder implements IStandingOrder {
  constructor(
    public id?: number,
    public externalId?: string | null,
    public reference?: string | null,
    public label?: string | null,
    public status?: string | null,
    public amount?: IAmount | null,
    public sepaBeneficiary?: ISEPABeneficiary | null
  ) {}
}

export function getStandingOrderIdentifier(standingOrder: IStandingOrder): number | undefined {
  return standingOrder.id;
}
