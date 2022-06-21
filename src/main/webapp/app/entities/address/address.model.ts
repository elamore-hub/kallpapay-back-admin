export interface IAddress {
  id?: number;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  postalCode?: string | null;
  state?: string | null;
  country?: string | null;
}

export class Address implements IAddress {
  constructor(
    public id?: number,
    public addressLine1?: string | null,
    public addressLine2?: string | null,
    public city?: string | null,
    public postalCode?: string | null,
    public state?: string | null,
    public country?: string | null
  ) {}
}

export function getAddressIdentifier(address: IAddress): number | undefined {
  return address.id;
}
