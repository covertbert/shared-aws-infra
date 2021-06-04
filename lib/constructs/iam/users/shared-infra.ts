import { Construct } from '@aws-cdk/core'
import { User, Policy } from '@aws-cdk/aws-iam'

export class SharedInfraDeploymentIamUser extends Construct {
  public readonly user: User

  constructor(scope: Construct, id: string) {
    super(scope, id)

    const name = 'SharedInfraStackDeploymentUser'

    this.user = new User(this, name, {
      userName: name,
    })

    const policy = new Policy(this, `${name}Policy`, {
      statements: [],
    })

    policy.attachToUser(this.user)
  }
}
