import { Stack, App, StackProps } from '@aws-cdk/core'
import { IamUser } from '../constructs/iam-user'

export class IAMStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    new IamUser(this, 'StackDeployment', {
      name: 'StackDeploymentUser',
      actions: [
        'cloudformation:*',
        'budgets:*',
        's3:*',
        'iam:*',
        'cloudfront:*',
        'acm:*',
        'route53:*',
        'ses:*',
        'sns:*',
      ],
    })
  }
}
