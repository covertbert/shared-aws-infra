#!/usr/bin/env node
import 'source-map-support/register'
import { App } from '@aws-cdk/core'

import { BudgetsStack } from '../lib/stacks/budgets'
import { IAMStack } from '../lib/stacks/iam'
import { CertificatesStack } from '../lib/stacks/certificates'
import { SharedDnsStack } from '../lib/stacks/shared-dns'

const regions = {
  primary: 'eu-west-2',
  secondary: 'us-east-1',
}

const app = new App()

new SharedDnsStack(app, 'shared-dns', { env: { region: regions.primary } })
new BudgetsStack(app, 'budgets', { env: { region: regions.primary } })
new IAMStack(app, 'iam', { env: { region: regions.primary } })
new CertificatesStack(app, 'certificates', { env: { region: regions.secondary } })
