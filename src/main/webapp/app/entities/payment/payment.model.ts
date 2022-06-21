import { IStandingOrder } from 'app/entities/standing-order/standing-order.model';
import { ITransaction } from 'app/entities/transaction/transaction.model';

export interface IPayment {
  id?: number;
  externalId?: string | null;
  status?: string | null;
  standingOrder?: IStandingOrder | null;
  transactions?: ITransaction[] | null;
}

export class Payment implements IPayment {
  constructor(
    public id?: number,
    public externalId?: string | null,
    public status?: string | null,
    public standingOrder?: IStandingOrder | null,
    public transactions?: ITransaction[] | null
  ) {}
}

export function getPaymentIdentifier(payment: IPayment): number | undefined {
  return payment.id;
}
