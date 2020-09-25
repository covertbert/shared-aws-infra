#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { BudgetsStack, IAMStack, StaticSiteStack } from '../lib'

const app = new cdk.App()

new BudgetsStack(app, 'budgets')
new IAMStack(app, 'iam')
new StaticSiteStack(app, 'bertie-blackman')
