import { IMyCause } from 'app/entities/my-cause/my-cause.model';

export interface IDonation {
  id?: number;
  myCause?: IMyCause | null;
}

export class Donation implements IDonation {
  constructor(public id?: number, public myCause?: IMyCause | null) {}
}

export function getDonationIdentifier(donation: IDonation): number | undefined {
  return donation.id;
}
