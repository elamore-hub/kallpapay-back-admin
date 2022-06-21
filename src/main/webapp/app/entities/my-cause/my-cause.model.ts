import { ICause } from 'app/entities/cause/cause.model';
import { IDonation } from 'app/entities/donation/donation.model';
import { IPortfolio } from 'app/entities/portfolio/portfolio.model';

export interface IMyCause {
  id?: number;
  percentage?: number | null;
  cause?: ICause | null;
  donations?: IDonation[] | null;
  portfolio?: IPortfolio | null;
}

export class MyCause implements IMyCause {
  constructor(
    public id?: number,
    public percentage?: number | null,
    public cause?: ICause | null,
    public donations?: IDonation[] | null,
    public portfolio?: IPortfolio | null
  ) {}
}

export function getMyCauseIdentifier(myCause: IMyCause): number | undefined {
  return myCause.id;
}
