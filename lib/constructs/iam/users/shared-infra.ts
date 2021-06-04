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
        'arn:aws:cloudformation:eu-west-2:515213366596:stack/shared-dns/*',
      ],
    })

    const budgetsPolicyStatement = new PolicyStatement({
      actions: ['budgets:*'],
      resources: ['arn:aws:budgets::515213366596:budget/CostBudget'],
    })

    const route53CreatePolicyStatement = new PolicyStatement({
      actions: ['route53:CreateHostedZone'],
      resources: ['*'],
    })

    const cloudfrontPolicyStatement = new PolicyStatement({
      actions: ['cloudfront:*'],
      resources: ['*'],
    })

    const route53UpdatePolicyStatement = new PolicyStatement({
      actions: ['route53:*'],
      resources: ['arn:aws:route53:::hostedzone/Z071345722DA6HTUYZ248'],
    })

    const iamPolicyStatement = new PolicyStatement({
      actions: ['iam:*'],
      resources: ['arn:aws:iam::515213366596:role/bertie-blackman-*'],
    })

    const lambdaPolicyStatement = new PolicyStatement({
      actions: ['lambda:*'],
      resources: ['arn:aws:lambda:eu-west-2:515213366596:function:bertie-blackman-*'],
    })

    const policy = new Policy(this, `${name}Policy`, {
      statements: [
        cloudformationPolicyStatement,
        budgetsPolicyStatement,
        route53CreatePolicyStatement,
        route53UpdatePolicyStatement,
        cloudfrontPolicyStatement,
        iamPolicyStatement,
        lambdaPolicyStatement,
      ],
    })

    policy.attachToUser(this.user)
  }
}
