#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { BudgetsStack, IAMStack, StaticSiteStack, CertificatesStack } from '../lib'

const app = new cdk.App()

new BudgetsStack(app, 'budgets')
new IAMStack(app, 'iam')
new StaticSiteStack(app, 'bertie-blackman')
new CertificatesStack(app, 'certificates', { env: { region: 'us-east-1' } })
