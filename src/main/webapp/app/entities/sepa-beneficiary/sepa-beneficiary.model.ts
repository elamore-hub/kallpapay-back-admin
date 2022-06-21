import { IAddress } from 'app/entities/address/address.model';

export interface ISEPABeneficiary {
  id?: number;
  externalId?: string | null;
  name?: string | null;
  isMyOwnIban?: boolean | null;
  maskedIBAN?: string | null;
  address?: IAddress | null;
}

export class SEPABeneficiary implements ISEPABeneficiary {
  constructor(
    public id?: number,
    public externalId?: string | null,
    public name?: string | null,
    public isMyOwnIban?: boolean | null,
    public maskedIBAN?: string | null,
    public address?: IAddress | null
  ) {
    this.isMyOwnIban = this.isMyOwnIban ?? false;
  }
}

export function getSEPABeneficiaryIdentifier(sEPABeneficiary: ISEPABeneficiary): number | undefined {
  return sEPABeneficiary.id;
}
