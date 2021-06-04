import { Stack, App, StackProps } from '@aws-cdk/core'
import { TvShowsDeploymentIamUser } from '../constructs/iam/users/tv-shows'
import { DeploymentGroup } from '../constructs/iam/groups/deployment'

export class IAMStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const deploymentGroup = new DeploymentGroup(this, 'DeploymentGroupDeployment')

    const tvShowsDeploymentUser = new TvShowsDeploymentIamUser(this, 'TvShowStackDeployment')

    deploymentGroup.group.addUser(tvShowsDeploymentUser.user)
  }
}
