import { IAmount } from 'app/entities/amount/amount.model';

export interface IAccountBalances {
  id?: number;
  available?: IAmount | null;
  booked?: IAmount | null;
  pending?: IAmount | null;
  reserved?: IAmount | null;
}

export class AccountBalances implements IAccountBalances {
  constructor(
    public id?: number,
    public available?: IAmount | null,
    public booked?: IAmount | null,
    public pending?: IAmount | null,
    public reserved?: IAmount | null
  ) {}
}

export function getAccountBalancesIdentifier(accountBalances: IAccountBalances): number | undefined {
  return accountBalances.id;
}
