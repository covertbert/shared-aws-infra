import { Stack, App, StackProps } from '@aws-cdk/core'
import { User, PolicyStatement, Role } from '@aws-cdk/aws-iam'

export class IAMStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const role = new Role(this, 'CloudformationDeploymentRole', {
      assumedBy: new User(this, 'CloudformationDeploymentUser', {
        userName: 'CloudformationDeploymentUser',
        managedPolicies: [
          {
            managedPolicyArn: 'arn:aws:iam::aws:policy/IAMSelfManageServiceSpecificCredentials',
          },
        ],
      }),
    })

    role.addToPolicy(
      new PolicyStatement({
        resources: ['*'],
        actions: ['budgets:*'],
      }),
    )
  }
}
