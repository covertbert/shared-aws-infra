import { Construct } from '@aws-cdk/core'
import { User } from '@aws-cdk/aws-iam'

export class BertieBlackmanDeploymentIamUser extends Construct {
  public readonly user: User

  constructor(scope: Construct, id: string) {
    super(scope, id)

    const name = 'BertieBlackmanDeploymentUser'

    this.user = new User(this, name, {
      userName: name,
    })
  }
}
