#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { BudgetsStack, IAMStack, StaticSiteStack, CertificatesStack, Route53Stack } from '../lib'

const app = new cdk.App()

new BudgetsStack(app, 'budgets')
new IAMStack(app, 'iam')
new CertificatesStack(app, 'certificates', { env: { region: 'us-east-1' } })
new StaticSiteStack(app, 'bertie-blackman')
new Route53Stack(app, 'route-53')
