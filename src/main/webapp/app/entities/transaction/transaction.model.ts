import { IAmount } from 'app/entities/amount/amount.model';
import { IBankAccount } from 'app/entities/bank-account/bank-account.model';
import { IIBAN } from 'app/entities/iban/iban.model';
import { IPayment } from 'app/entities/payment/payment.model';

export interface ITransaction {
  id?: number;
  externalId?: string | null;
  reference?: string | null;
  paymentMethodIdentifier?: string | null;
  side?: string | null;
  type?: string | null;
  label?: string | null;
  status?: string | null;
  paymentId?: string | null;
  counterparty?: string | null;
  paymentProduct?: string | null;
  externalReference?: string | null;
  amount?: IAmount | null;
  bankAccount?: IBankAccount | null;
  iBAN?: IIBAN | null;
  payment?: IPayment | null;
}

export class Transaction implements ITransaction {
  constructor(
    public id?: number,
    public externalId?: string | null,
    public reference?: string | null,
    public paymentMethodIdentifier?: string | null,
    public side?: string | null,
    public type?: string | null,
    public label?: string | null,
    public status?: string | null,
    public paymentId?: string | null,
    public counterparty?: string | null,
    public paymentProduct?: string | null,
    public externalReference?: string | null,
    public amount?: IAmount | null,
    public bankAccount?: IBankAccount | null,
    public iBAN?: IIBAN | null,
    public payment?: IPayment | null
  ) {}
}

export function getTransactionIdentifier(transaction: ITransaction): number | undefined {
  return transaction.id;
}
