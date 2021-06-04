import { Construct } from '@aws-cdk/core'
import { User, Policy, PolicyStatement } from '@aws-cdk/aws-iam'

export class SharedInfraDeploymentIamUser extends Construct {
  public readonly user: User

  constructor(scope: Construct, id: string) {
    super(scope, id)

    const name = 'SharedInfraStackDeploymentUser'

    this.user = new User(this, name, {
      userName: name,
    })

    const cloudformationPolicyStatement = new PolicyStatement({
      actions: ['cloudformation:*'],
      resources: [
        'arn:aws:cloudformation:eu-west-2:515213366596:stack/bertie-blackman/*',
        'arn:aws:cloudformation:eu-west-1:515213366596:stack/certificates/*',
        'arn:aws:cloudformation:eu-west-2:515213366596:stack/budgets/*',
      ],
    })

    const policy = new Policy(this, `${name}Policy`, {
      statements: [cloudformationPolicyStatement],
    })

    policy.attachToUser(this.user)
  }
}
