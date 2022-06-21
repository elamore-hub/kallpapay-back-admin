export interface IAddressInfo {
  id?: number;
  name?: string | null;
}

export class AddressInfo implements IAddressInfo {
  constructor(public id?: number, public name?: string | null) {}
}

export function getAddressInfoIdentifier(addressInfo: IAddressInfo): number | undefined {
  return addressInfo.id;
}
