import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'account-holder-info',
        data: { pageTitle: 'kallpapayApp.accountHolderInfo.home.title' },
        loadChildren: () => import('./account-holder-info/account-holder-info.module').then(m => m.AccountHolderInfoModule),
      },
      {
        path: 'address-info',
        data: { pageTitle: 'kallpapayApp.addressInfo.home.title' },
        loadChildren: () => import('./address-info/address-info.module').then(m => m.AddressInfoModule),
      },
      {
        path: 'account-holder',
        data: { pageTitle: 'kallpapayApp.accountHolder.home.title' },
        loadChildren: () => import('./account-holder/account-holder.module').then(m => m.AccountHolderModule),
      },
      {
        path: 'account-membership',
        data: { pageTitle: 'kallpapayApp.accountMembership.home.title' },
        loadChildren: () => import('./account-membership/account-membership.module').then(m => m.AccountMembershipModule),
      },
      {
        path: 'amount',
        data: { pageTitle: 'kallpapayApp.amount.home.title' },
        loadChildren: () => import('./amount/amount.module').then(m => m.AmountModule),
      },
      {
        path: 'bank-account',
        data: { pageTitle: 'kallpapayApp.bankAccount.home.title' },
        loadChildren: () => import('./bank-account/bank-account.module').then(m => m.BankAccountModule),
      },
      {
        path: 'account-balances',
        data: { pageTitle: 'kallpapayApp.accountBalances.home.title' },
        loadChildren: () => import('./account-balances/account-balances.module').then(m => m.AccountBalancesModule),
      },
      {
        path: 'card',
        data: { pageTitle: 'kallpapayApp.card.home.title' },
        loadChildren: () => import('./card/card.module').then(m => m.CardModule),
      },
      {
        path: 'iban',
        data: { pageTitle: 'kallpapayApp.iBAN.home.title' },
        loadChildren: () => import('./iban/iban.module').then(m => m.IBANModule),
      },
      {
        path: 'payment',
        data: { pageTitle: 'kallpapayApp.payment.home.title' },
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
      },
      {
        path: 'standing-order',
        data: { pageTitle: 'kallpapayApp.standingOrder.home.title' },
        loadChildren: () => import('./standing-order/standing-order.module').then(m => m.StandingOrderModule),
      },
      {
        path: 'sepa-beneficiary',
        data: { pageTitle: 'kallpapayApp.sEPABeneficiary.home.title' },
        loadChildren: () => import('./sepa-beneficiary/sepa-beneficiary.module').then(m => m.SEPABeneficiaryModule),
      },
      {
        path: 'address',
        data: { pageTitle: 'kallpapayApp.address.home.title' },
        loadChildren: () => import('./address/address.module').then(m => m.AddressModule),
      },
      {
        path: 'transaction',
        data: { pageTitle: 'kallpapayApp.transaction.home.title' },
        loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionModule),
      },
      {
        path: 'onboarding',
        data: { pageTitle: 'kallpapayApp.onboarding.home.title' },
        loadChildren: () => import('./onboarding/onboarding.module').then(m => m.OnboardingModule),
      },
      {
        path: 'o-auth-redirect-parameters',
        data: { pageTitle: 'kallpapayApp.oAuthRedirectParameters.home.title' },
        loadChildren: () =>
          import('./o-auth-redirect-parameters/o-auth-redirect-parameters.module').then(m => m.OAuthRedirectParametersModule),
      },
      {
        path: 'supporting-document',
        data: { pageTitle: 'kallpapayApp.supportingDocument.home.title' },
        loadChildren: () => import('./supporting-document/supporting-document.module').then(m => m.SupportingDocumentModule),
      },
      {
        path: 'portfolio',
        data: { pageTitle: 'kallpapayApp.portfolio.home.title' },
        loadChildren: () => import('./portfolio/portfolio.module').then(m => m.PortfolioModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'kallpapayApp.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'cause',
        data: { pageTitle: 'kallpapayApp.cause.home.title' },
        loadChildren: () => import('./cause/cause.module').then(m => m.CauseModule),
      },
      {
        path: 'my-cause',
        data: { pageTitle: 'kallpapayApp.myCause.home.title' },
        loadChildren: () => import('./my-cause/my-cause.module').then(m => m.MyCauseModule),
      },
      {
        path: 'donation',
        data: { pageTitle: 'kallpapayApp.donation.home.title' },
        loadChildren: () => import('./donation/donation.module').then(m => m.DonationModule),
      },
      {
        path: 'participation',
        data: { pageTitle: 'kallpapayApp.participation.home.title' },
        loadChildren: () => import('./participation/participation.module').then(m => m.ParticipationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
