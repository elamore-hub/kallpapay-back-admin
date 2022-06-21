import dayjs from 'dayjs/esm';
import { IAmount } from 'app/entities/amount/amount.model';
import { IPortfolio } from 'app/entities/portfolio/portfolio.model';

export interface IParticipation {
  id?: number;
  creationDate?: dayjs.Dayjs | null;
  amount?: IAmount | null;
  portfolio?: IPortfolio | null;
}

export class Participation implements IParticipation {
  constructor(
    public id?: number,
    public creationDate?: dayjs.Dayjs | null,
    public amount?: IAmount | null,
    public portfolio?: IPortfolio | null
  ) {}
}

export function getParticipationIdentifier(participation: IParticipation): number | undefined {
  return participation.id;
}
