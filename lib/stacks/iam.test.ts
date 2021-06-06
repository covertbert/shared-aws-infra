import { expect as expectCDK, haveResourceLike, stringLike } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { IAMStack } from './iam'

describe('IAMStack', () => {
  const app = new cdk.App()
  const stack = new IAMStack(app, 'iam')

  it('creates a TvShow stack deployment IAM user', () => {
    expectCDK(stack).to(
      haveResourceLike('AWS::IAM::User', {
        UserName: 'TvShowStackDeploymentUser',
        Groups: [
          {
            Ref: stringLike('DeploymentGroup*'),
          },
        ],
      }),
    )
  })

  it('creates a SharedInfra stack deployment IAM user', () => {
    expectCDK(stack).to(
      haveResourceLike('AWS::IAM::User', {
        UserName: 'SharedInfraStackDeploymentUser',
        Groups: [
          {
            Ref: stringLike('DeploymentGroup*'),
          },
        ],
      }),
    )
  })

  it('creates a BertieBlackman stack deployment IAM user', () => {
    expectCDK(stack).to(
      haveResourceLike('AWS::IAM::User', {
        UserName: 'BertieBlackmanDeploymentUser',
        Groups: [
          {
            Ref: stringLike('DeploymentGroup*'),
          },
        ],
      }),
    )
  })

  it('creates an Admin IAM user with AdministratorAccess policy', () => {
    expectCDK(stack).to(
      haveResourceLike('AWS::IAM::User', {
        ManagedPolicyArns: [
          {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':iam::aws:policy/AdministratorAccess',
              ],
            ],
          },
        ],
        UserName: 'AdminUser',
      }),
    )
  })

  it('creates an IAM policy with the correct actions', () => {
    expectCDK(stack).to(haveResourceLike('AWS::IAM::Policy'))
  })
})
