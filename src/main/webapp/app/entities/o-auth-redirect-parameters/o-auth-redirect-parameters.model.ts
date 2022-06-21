export interface IOAuthRedirectParameters {
  id?: number;
  state?: string | null;
  redirectUrl?: string | null;
}

export class OAuthRedirectParameters implements IOAuthRedirectParameters {
  constructor(public id?: number, public state?: string | null, public redirectUrl?: string | null) {}
}

export function getOAuthRedirectParametersIdentifier(oAuthRedirectParameters: IOAuthRedirectParameters): number | undefined {
  return oAuthRedirectParameters.id;
}
