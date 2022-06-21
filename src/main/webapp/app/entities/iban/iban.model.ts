import { ITransaction } from 'app/entities/transaction/transaction.model';
import { IBankAccount } from 'app/entities/bank-account/bank-account.model';

export interface IIBAN {
  id?: number;
  name?: string | null;
  iban?: string | null;
  bic?: string | null;
  accountOwner?: string | null;
  transactions?: ITransaction[] | null;
  bankAccount?: IBankAccount | null;
}

export class IBAN implements IIBAN {
  constructor(
    public id?: number,
    public name?: string | null,
    public iban?: string | null,
    public bic?: string | null,
    public accountOwner?: string | null,
    public transactions?: ITransaction[] | null,
    public bankAccount?: IBankAccount | null
  ) {}
}

export function getIBANIdentifier(iBAN: IIBAN): number | undefined {
  return iBAN.id;
}
