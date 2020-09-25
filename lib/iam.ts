import { Stack, App, StackProps } from '@aws-cdk/core'
import { User, Policy, PolicyStatement } from '@aws-cdk/aws-iam'

export class IAMStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const user = new User(this, 'CloudformationDeploymentUser', {
      userName: 'CloudformationDeploymentUser',
    })

    const statement = new PolicyStatement()
    statement.addActions('cloudformation:*')
    statement.addResources('*')

    const policy = new Policy(this, 'CloudformationDeploymentPolicy', {
      statements: [statement],
    })

    policy.attachToUser(user)
  }
}
