import { Construct } from '@aws-cdk/core'
import { Policy, PolicyStatement, Group } from '@aws-cdk/aws-iam'

export class DeploymentGroup extends Construct {
  public readonly group: Group

  constructor(scope: Construct, id: string) {
    super(scope, id)

    const name = 'DeploymentGroup'

    const toolkitCloudformationPolicyStatement = new PolicyStatement({
      actions: ['cloudformation:Describe*'],
      resources: ['*'],
    })

    const route53PolicyStatement = new PolicyStatement({
      actions: ['route53:List*', 'route53:Get*'],
      resources: ['*'],
    })

    const eventsPolicyStatement = new PolicyStatement({
      actions: ['events:Describe*'],
      resources: ['*'],
    })

    const logsPolicyStatement = new PolicyStatement({
      actions: ['logs:*'],
      resources: ['*'],
    })

    const acmPolicyStatement = new PolicyStatement({
      actions: ['acm:*Certificate'],
      resources: ['*'],
    })

    const s3PolicyStatement = new PolicyStatement({
      actions: ['s3:getBucketLocation', 's3:ListBucket', 's3:*Object'],
      resources: ['*'],
    })

    this.group = new Group(this, `${name}Group`, { groupName: name })

    const policy = new Policy(this, `${name}Policy`, {
      statements: [
        toolkitCloudformationPolicyStatement,
        route53PolicyStatement,
        eventsPolicyStatement,
        logsPolicyStatement,
        acmPolicyStatement,
        s3PolicyStatement,
      ],
    })

    policy.attachToGroup(this.group)
  }
}
