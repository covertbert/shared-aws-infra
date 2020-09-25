import { Stack, App, StackProps } from '@aws-cdk/core'
import { User } from '@aws-cdk/aws-iam'

export class IAMStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    new User(this, 'DeploymentUser')
  }
}
