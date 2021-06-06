import { expect as expectCDK, haveResourceLike, objectLike, stringLike } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { IAMStack } from './iam'

describe('IAMStack', () => {
  const app = new cdk.App()
  const stack = new IAMStack(app, 'iam')

  describe('TvShow User', () => {
    it('has an IAM user', () => {
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

    it('has an IAM policy with the correct actions', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [
              objectLike({ Action: 'apigateway:*' }),
              objectLike({ Action: 'cloudformation:*' }),
              objectLike({ Action: 'iam:*' }),
              objectLike({ Action: 'route53:ChangeResourceRecordSets' }),
              objectLike({ Action: 'lambda:*' }),
              objectLike({ Action: 'dynamodb:*' }),
              objectLike({ Action: 'events:*' }),
            ],
            Version: '2012-10-17',
          },
          PolicyName: stringLike('TvShowStack*'),
          Users: [
            {
              Ref: stringLike('TvShowStack*'),
            },
          ],
        }),
      )
    })
  })

  describe('SharedInfra User', () => {
    it('has an IAM user', () => {
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

    it('has an IAM policy with the correct actions', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [
              objectLike({ Action: 'cloudformation:*' }),
              objectLike({ Action: 'budgets:*' }),
              objectLike({ Action: 'route53:CreateHostedZone' }),
              objectLike({ Action: 'route53:*' }),
            ],
            Version: '2012-10-17',
          },
          PolicyName: stringLike('SharedInfra*'),
          Users: [
            {
              Ref: stringLike('SharedInfra*'),
            },
          ],
        }),
      )
    })
  })

  describe('BertieBlackman User', () => {
    it('has an IAM user', () => {
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

    it('has an IAM policy with the correct actions', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [
              objectLike({ Action: 'cloudformation:*' }),
              objectLike({ Action: 'lambda:*' }),
              objectLike({ Action: 'iam:*' }),
              objectLike({ Action: 'cloudfront:*' }),
              objectLike({ Action: 's3:*' }),
              objectLike({ Action: 'route53:ChangeResourceRecordSets' }),
            ],
            Version: '2012-10-17',
          },
          PolicyName: stringLike('BertieBlackman*'),
          Users: [
            {
              Ref: stringLike('BertieBlackman*'),
            },
          ],
        }),
      )
    })
  })

  describe('Admin User', () => {
    it('has an IAM user', () => {
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
  })
})
