import { Construct } from '@aws-cdk/core'
import { User, Policy, PolicyStatement } from '@aws-cdk/aws-iam'

export class S3PhotoStorageIamUser extends Construct {
  public readonly user: User

  constructor(scope: Construct, id: string) {
    super(scope, id)

    const name = 'S3PhotoStorageUser'

    this.user = new User(this, name, {
      userName: name,
    })

    const route53UpdatePolicyStatement = new PolicyStatement({
      actions: ['s3:*'],
      resources: ['arn:aws:s3:::bertie-blackman-photo-storage/*'],
    })

    const policy = new Policy(this, `${name}Policy`, {
      statements: [route53UpdatePolicyStatement],
    })

    policy.attachToUser(this.user)
  }
}
