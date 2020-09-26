import { Stack, App, StackProps } from '@aws-cdk/core'
import { User, Policy, PolicyStatement } from '@aws-cdk/aws-iam'

export class IAMStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const user = new User(this, 'StackDeploymentUser', {
      userName: 'StackDeploymentUser',
    })

    const stackDeploymentStatement = new PolicyStatement({
      actions: ['cloudformation:*', 'budgets:*', 's3:*', 'iam:*', 'cloudfront:*', 'acm:*'],
      resources: ['*'],
    })

    const policy = new Policy(this, 'StackDeploymentPolicy', {
      statements: [stackDeploymentStatement],
    })

    policy.attachToUser(user)
  }
}
