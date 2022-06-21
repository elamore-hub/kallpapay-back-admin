export interface IAccountHolderInfo {
  id?: number;
  type?: string | null;
  name?: string | null;
}

export class AccountHolderInfo implements IAccountHolderInfo {
  constructor(public id?: number, public type?: string | null, public name?: string | null) {}
}

export function getAccountHolderInfoIdentifier(accountHolderInfo: IAccountHolderInfo): number | undefined {
  return accountHolderInfo.id;
}
