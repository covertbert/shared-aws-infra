#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { BudgetsStack, IAMStack, S3Stack } from '../lib'

const app = new cdk.App()

new BudgetsStack(app, 'BudgetsStack')
new IAMStack(app, 'IAMStack')
new S3Stack(app, 'S3Stack')
