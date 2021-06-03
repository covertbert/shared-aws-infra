import { Construct } from '@aws-cdk/core'
import { User, Policy, PolicyStatement } from '@aws-cdk/aws-iam'

export interface IamUserProperties {
  name: string
  actions: string[]
}

export class IamUser extends Construct {
  constructor(scope: Construct, id: string, props: IamUserProperties) {
    super(scope, id)

    const { name, actions } = props

    const user = new User(this, name, {
      userName: name,
    })

    const stackDeploymentStatement = new PolicyStatement({
      actions,
      resources: ['*'],
    })

    const policy = new Policy(this, `${name}Policy`, {
      statements: [stackDeploymentStatement],
    })

    policy.attachToUser(user)
  }
}
