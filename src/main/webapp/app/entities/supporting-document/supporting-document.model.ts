import { IAccountHolder } from 'app/entities/account-holder/account-holder.model';
import { IOnboarding } from 'app/entities/onboarding/onboarding.model';

export interface ISupportingDocument {
  id?: number;
  externalId?: string | null;
  status?: string | null;
  supportingDocumentType?: string | null;
  supportingDocumentPurpose?: string | null;
  accountHolder?: IAccountHolder | null;
  onboarding?: IOnboarding | null;
}

export class SupportingDocument implements ISupportingDocument {
  constructor(
    public id?: number,
    public externalId?: string | null,
    public status?: string | null,
    public supportingDocumentType?: string | null,
    public supportingDocumentPurpose?: string | null,
    public accountHolder?: IAccountHolder | null,
    public onboarding?: IOnboarding | null
  ) {}
}

export function getSupportingDocumentIdentifier(supportingDocument: ISupportingDocument): number | undefined {
  return supportingDocument.id;
}
