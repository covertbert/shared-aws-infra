#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { BudgetsStack } from '../lib/budgets'

const app = new cdk.App()

new BudgetsStack(app, 'BudgetsStack')
