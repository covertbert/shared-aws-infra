import { Construct } from '@aws-cdk/core'
import { User, Policy, PolicyStatement } from '@aws-cdk/aws-iam'

interface Props {
  route53ZoneId: string
}

export class TvShowsDeploymentIamUser extends Construct {
  public readonly user: User

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    const { route53ZoneId } = props

    const name = 'TvShowStackDeploymentUser'

    this.user = new User(this, name, {
      userName: name,
    })

    const apiGatewayPolicyStatement = new PolicyStatement({
      actions: ['apigateway:*'],
      resources: ['*'],
    })

    const cloudformationPolicyStatement = new PolicyStatement({
      actions: ['cloudformation:*'],
      resources: ['arn:aws:cloudformation:eu-west-2:515213366596:stack/tv-shows-lambda-stack/*'],
    })

    const iamPolicyStatement = new PolicyStatement({
      actions: ['iam:*'],
      resources: ['arn:aws:iam::515213366596:role/tv-shows-lambda-stack-*'],
    })

    const route53PolicyStatement = new PolicyStatement({
      actions: ['route53:ChangeResourceRecordSets'],
      resources: [`arn:aws:route53:::hostedzone/${route53ZoneId}`],
    })

    const lambdaPolicyStatement = new PolicyStatement({
      actions: ['lambda:*'],
      resources: [
        'arn:aws:lambda:eu-west-2:515213366596:function:get-lambda',
        'arn:aws:lambda:eu-west-2:515213366596:function:email-lambda',
      ],
    })

    const dynamoPolicyStatement = new PolicyStatement({
      actions: ['dynamodb:*'],
      resources: ['arn:aws:dynamodb:eu-west-2:515213366596:table/TVShowsTable'],
    })

    const eventsPolicyStatement = new PolicyStatement({
      actions: ['events:*'],
      resources: ['arn:aws:events:eu-west-2:515213366596:rule/tv-shows-lambda-stack-*'],
    })

    const policy = new Policy(this, `${name}Policy`, {
      statements: [
        apiGatewayPolicyStatement,
        cloudformationPolicyStatement,
        iamPolicyStatement,
        route53PolicyStatement,
        lambdaPolicyStatement,
        dynamoPolicyStatement,
        eventsPolicyStatement,
      ],
    })

    policy.attachToUser(this.user)
  }
}
