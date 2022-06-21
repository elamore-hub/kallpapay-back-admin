import { ICard } from 'app/entities/card/card.model';
import { IBankAccount } from 'app/entities/bank-account/bank-account.model';

export interface IAccountMembership {
  id?: number;
  externalId?: string | null;
  email?: string | null;
  status?: string | null;
  cards?: ICard[] | null;
  bankAccount?: IBankAccount | null;
}

export class AccountMembership implements IAccountMembership {
  constructor(
    public id?: number,
    public externalId?: string | null,
    public email?: string | null,
    public status?: string | null,
    public cards?: ICard[] | null,
    public bankAccount?: IBankAccount | null
  ) {}
}

export function getAccountMembershipIdentifier(accountMembership: IAccountMembership): number | undefined {
  return accountMembership.id;
}
