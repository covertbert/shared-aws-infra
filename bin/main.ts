#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { BudgetsStack, IAMStack, StaticSiteStack, CertificatesStack, SESStack } from '../lib'

const regions = {
  primary: 'eu-west-2',
  secondary: 'us-east-1',
}

const app = new cdk.App()

new BudgetsStack(app, 'budgets', { env: { region: regions.primary } })
new IAMStack(app, 'iam', { env: { region: regions.primary } })
new CertificatesStack(app, 'certificates', { env: { region: regions.secondary } })
new StaticSiteStack(app, 'bertie-blackman', {
  env: { region: regions.primary },
  recordName: 'www',
  domainName: 'bertie.dev',
})
new SESStack(app, 'bertie-blackman-ses', { env: { region: regions.secondary } })
