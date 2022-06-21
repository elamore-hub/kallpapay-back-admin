import { IAccountBalances } from 'app/entities/account-balances/account-balances.model';
import { IAccountMembership } from 'app/entities/account-membership/account-membership.model';
import { IIBAN } from 'app/entities/iban/iban.model';
import { ITransaction } from 'app/entities/transaction/transaction.model';
import { IAccountHolder } from 'app/entities/account-holder/account-holder.model';

export interface IBankAccount {
  id?: number;
  externalId?: string | null;
  number?: string | null;
  name?: string | null;
  currency?: string | null;
  status?: string | null;
  language?: string | null;
  balances?: IAccountBalances | null;
  accountMemberships?: IAccountMembership[] | null;
  iBANS?: IIBAN[] | null;
  transactions?: ITransaction[] | null;
  accountHolder?: IAccountHolder | null;
}

export class BankAccount implements IBankAccount {
  constructor(
    public id?: number,
    public externalId?: string | null,
    public number?: string | null,
    public name?: string | null,
    public currency?: string | null,
    public status?: string | null,
    public language?: string | null,
    public balances?: IAccountBalances | null,
    public accountMemberships?: IAccountMembership[] | null,
    public iBANS?: IIBAN[] | null,
    public transactions?: ITransaction[] | null,
    public accountHolder?: IAccountHolder | null
  ) {}
}

export function getBankAccountIdentifier(bankAccount: IBankAccount): number | undefined {
  return bankAccount.id;
}
