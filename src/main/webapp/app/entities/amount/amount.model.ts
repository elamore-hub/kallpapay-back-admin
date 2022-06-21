export interface IAmount {
  id?: number;
  currency?: string | null;
  value?: number | null;
}

export class Amount implements IAmount {
  constructor(public id?: number, public currency?: string | null, public value?: number | null) {}
}

export function getAmountIdentifier(amount: IAmount): number | undefined {
  return amount.id;
}
