import { Construct } from '@aws-cdk/core'
import { User, ManagedPolicy } from '@aws-cdk/aws-iam'

export class AdminIamUser extends Construct {
  public readonly user: User

  constructor(scope: Construct, id: string) {
    super(scope, id)

    const name = 'AdminUser'

    this.user = new User(this, name, {
      userName: name,
    })

    this.user.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'))
  }
}
