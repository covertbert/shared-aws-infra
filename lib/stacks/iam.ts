import { Stack, App, StackProps } from '@aws-cdk/core'

import { DeploymentGroup } from '../constructs/iam/groups/deployment'

import { AdminIamUser } from '../constructs/iam/users/admin'
import { TvShowsDeploymentIamUser } from '../constructs/iam/users/tv-shows'
import { SharedInfraDeploymentIamUser } from '../constructs/iam/users/shared-infra'
import { BertieBlackmanDeploymentIamUser } from '../constructs/iam/users/bertie-blackman'

export class IAMStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const route53ZoneId = 'Z071345722DA6HTUYZ248'

    const deploymentGroup = new DeploymentGroup(this, 'DeploymentGroupDeployment')

    new AdminIamUser(this, 'AdminStackDeployment')

    const tvShowsDeploymentUser = new TvShowsDeploymentIamUser(this, 'TvShowStackDeployment', {
      route53ZoneId,
    })

    const sharedInfraDeploymentUser = new SharedInfraDeploymentIamUser(
      this,
      'SharedInfraStackDeployment',
      { route53ZoneId },
    )

    const bertieBlackmanDeploymentUser = new BertieBlackmanDeploymentIamUser(
      this,
      'BertieBlackmanStackDeployment',
      { route53ZoneId },
    )

    deploymentGroup.group.addUser(tvShowsDeploymentUser.user)
    deploymentGroup.group.addUser(sharedInfraDeploymentUser.user)
    deploymentGroup.group.addUser(bertieBlackmanDeploymentUser.user)
  }
}
