import { Construct } from '@aws-cdk/core'
import { User, PolicyStatement, Policy } from '@aws-cdk/aws-iam'

interface Props {
  route53ZoneId: string
}

export class BertieBlackmanDeploymentIamUser extends Construct {
  public readonly user: User

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    const { route53ZoneId } = props

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
      resources: [
        'arn:aws:lambda:eu-west-2:515213366596:function:bertie-blackman-*',
        'arn:aws:lambda:eu-west-2:515213366596:layer:deployStaticWebsiteAwsCliLayer*',
      ],
    })

    const iamPolicyStatement = new PolicyStatement({
      actions: ['iam:*'],
      resources: ['arn:aws:iam::515213366596:role/bertie-blackman-*'],
    })

    const cloudfrontPolicyStatement = new PolicyStatement({
      actions: ['cloudfront:*'],
      resources: ['*'],
    })

    const s3PolicyStatement = new PolicyStatement({
      actions: ['s3:*'],
      resources: ['arn:aws:s3:::bertie-blackman-artifacts'],
    })

    const route53PolicyStatement = new PolicyStatement({
      actions: ['route53:ChangeResourceRecordSets'],
      resources: [`arn:aws:route53:::hostedzone/${route53ZoneId}`],
    })

    const policy = new Policy(this, `${name}Policy`, {
      statements: [
        cloudformationPolicyStatement,
        lambdaPolicyStatement,
        iamPolicyStatement,
        cloudfrontPolicyStatement,
        s3PolicyStatement,
        route53PolicyStatement,
      ],
    })

    policy.attachToUser(this.user)
  }
}
