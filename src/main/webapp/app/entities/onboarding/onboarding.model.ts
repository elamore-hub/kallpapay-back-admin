import { IAccountHolder } from 'app/entities/account-holder/account-holder.model';
import { IOAuthRedirectParameters } from 'app/entities/o-auth-redirect-parameters/o-auth-redirect-parameters.model';
import { ISupportingDocument } from 'app/entities/supporting-document/supporting-document.model';

export interface IOnboarding {
  id?: number;
  externalId?: string | null;
  accountName?: string | null;
  email?: string | null;
  language?: string | null;
  accountHolderType?: string | null;
  onboardingUrl?: string | null;
  onboardingState?: string | null;
  redirectUrl?: string | null;
  status?: string | null;
  tcuUrl?: string | null;
  accountHolder?: IAccountHolder | null;
  oAuthRedirectParameters?: IOAuthRedirectParameters | null;
  supportingDocuments?: ISupportingDocument[] | null;
}

export class Onboarding implements IOnboarding {
  constructor(
    public id?: number,
    public externalId?: string | null,
    public accountName?: string | null,
    public email?: string | null,
    public language?: string | null,
    public accountHolderType?: string | null,
    public onboardingUrl?: string | null,
    public onboardingState?: string | null,
    public redirectUrl?: string | null,
    public status?: string | null,
    public tcuUrl?: string | null,
    public accountHolder?: IAccountHolder | null,
    public oAuthRedirectParameters?: IOAuthRedirectParameters | null,
    public supportingDocuments?: ISupportingDocument[] | null
  ) {}
}

export function getOnboardingIdentifier(onboarding: IOnboarding): number | undefined {
  return onboarding.id;
}
