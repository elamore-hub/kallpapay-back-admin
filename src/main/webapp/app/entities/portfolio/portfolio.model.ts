import { ICategory } from 'app/entities/category/category.model';
import { IParticipation } from 'app/entities/participation/participation.model';
import { IMyCause } from 'app/entities/my-cause/my-cause.model';
import { ICard } from 'app/entities/card/card.model';
import { Method } from 'app/entities/enumerations/method.model';

export interface IPortfolio {
  id?: number;
  limitAmount?: number | null;
  amount?: number | null;
  limitPercentage?: number | null;
  percentage?: number | null;
  method?: Method | null;
  categories?: ICategory[] | null;
  participations?: IParticipation[] | null;
  myCauses?: IMyCause[] | null;
  card?: ICard | null;
}

export class Portfolio implements IPortfolio {
  constructor(
    public id?: number,
    public limitAmount?: number | null,
    public amount?: number | null,
    public limitPercentage?: number | null,
    public percentage?: number | null,
    public method?: Method | null,
    public categories?: ICategory[] | null,
    public participations?: IParticipation[] | null,
    public myCauses?: IMyCause[] | null,
    public card?: ICard | null
  ) {}
}

export function getPortfolioIdentifier(portfolio: IPortfolio): number | undefined {
  return portfolio.id;
}
