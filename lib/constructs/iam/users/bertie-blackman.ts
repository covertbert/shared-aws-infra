import { Construct } from '@aws-cdk/core'
import { User, PolicyStatement, Policy } from '@aws-cdk/aws-iam'

export class BertieBlackmanDeploymentIamUser extends Construct {
  public readonly user: User

  constructor(scope: Construct, id: string) {
    super(scope, id)

    const name = 'BertieBlackmanDeploymentUser'

    this.user = new User(this, name, {
      userName: name,
    })

    const cloudformationPolicyStatement = new PolicyStatement({
      actions: ['cloudformation:*'],
      resources: ['arn:aws:cloudformation:eu-west-2:515213366596:stack/bertie-blackman/*'],
    })

    const lambdaPolicyStatement = new PolicyStatement({
      actions: ['lambda:*'],
      resources: ['arn:aws:lambda:eu-west-2:515213366596:function:bertie-blackman-*'],
    })

    const iamPolicyStatement = new PolicyStatement({
      actions: ['iam:*'],
      resources: ['arn:aws:iam::515213366596:role/bertie-blackman-*'],
    })

    const cloudfrontPolicyStatement = new PolicyStatement({
      actions: ['cloudfront:*'],
      resources: ['arn:aws:cloudfront::515213366596:distribution/*'],
    })

    const policy = new Policy(this, `${name}Policy`, {
      statements: [
        cloudformationPolicyStatement,
        lambdaPolicyStatement,
        iamPolicyStatement,
        cloudfrontPolicyStatement,
      ],
    })

    policy.attachToUser(this.user)
  }
}
