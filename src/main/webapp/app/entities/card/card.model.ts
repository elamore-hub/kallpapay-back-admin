import dayjs from 'dayjs/esm';
import { IPortfolio } from 'app/entities/portfolio/portfolio.model';
import { IAccountMembership } from 'app/entities/account-membership/account-membership.model';

export interface ICard {
  id?: number;
  externalId?: string | null;
  type?: string | null;
  mainCurrency?: string | null;
  cardDesignUrl?: string | null;
  cardUrl?: string | null;
  status?: string | null;
  expiryDate?: dayjs.Dayjs | null;
  name?: string | null;
  portfolios?: IPortfolio[] | null;
  accountMembership?: IAccountMembership | null;
}

export class Card implements ICard {
  constructor(
    public id?: number,
    public externalId?: string | null,
    public type?: string | null,
    public mainCurrency?: string | null,
    public cardDesignUrl?: string | null,
    public cardUrl?: string | null,
    public status?: string | null,
    public expiryDate?: dayjs.Dayjs | null,
    public name?: string | null,
    public portfolios?: IPortfolio[] | null,
    public accountMembership?: IAccountMembership | null
  ) {}
}

export function getCardIdentifier(card: ICard): number | undefined {
  return card.id;
}
