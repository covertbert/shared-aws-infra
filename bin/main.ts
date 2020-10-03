#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import {
  BudgetsStack,
  IAMStack,
  StaticSiteStack,
  CertificatesStack,
  SESStack,
  DynamoStack,
} from '../lib'

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
  certificateARN:
    'arn:aws:acm:us-east-1:515213366596:certificate/904b7400-ca9a-4f45-8f77-91deccfd79c1',
})

new SESStack(app, 'bertie-blackman-ses', {
  env: { region: regions.secondary },
  forwardingAddress: 'blackmanrgh@gmail.com',
})

new DynamoStack(app, 'speed-test', { env: { region: regions.primary } })
