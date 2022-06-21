import { ICategory } from 'app/entities/category/category.model';
import { IMyCause } from 'app/entities/my-cause/my-cause.model';

export interface ICause {
  id?: number;
  name?: string | null;
  description?: string | null;
  logoContentType?: string | null;
  logo?: string | null;
  categories?: ICategory[] | null;
  myCause?: IMyCause | null;
}

export class Cause implements ICause {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public logoContentType?: string | null,
    public logo?: string | null,
    public categories?: ICategory[] | null,
    public myCause?: IMyCause | null
  ) {}
}

export function getCauseIdentifier(cause: ICause): number | undefined {
  return cause.id;
}
