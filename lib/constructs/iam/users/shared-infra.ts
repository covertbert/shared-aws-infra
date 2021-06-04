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
        'arn:aws:cloudformation:us-east-1:515213366596:stack/certificates/*',
        'arn:aws:cloudformation:eu-west-2:515213366596:stack/budgets/*',
      ],
    })

    const budgetsPolicyStatement = new PolicyStatement({
      actions: ['budgets:*'],
      resources: ['arn:aws:budgets::515213366596:budget/CostBudget'],
    })

    const policy = new Policy(this, `${name}Policy`, {
      statements: [cloudformationPolicyStatement, budgetsPolicyStatement],
    })

    policy.attachToUser(this.user)
  }
}
