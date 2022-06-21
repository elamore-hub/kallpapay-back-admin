import { IPortfolio } from 'app/entities/portfolio/portfolio.model';
import { ICause } from 'app/entities/cause/cause.model';

export interface ICategory {
  id?: number;
  name?: string | null;
  description?: string | null;
  logoContentType?: string | null;
  logo?: string | null;
  portfolio?: IPortfolio | null;
  cause?: ICause | null;
}

export class Category implements ICategory {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public logoContentType?: string | null,
    public logo?: string | null,
    public portfolio?: IPortfolio | null,
    public cause?: ICause | null
  ) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
