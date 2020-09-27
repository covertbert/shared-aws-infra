import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { IAMStack } from '../lib'

describe('IAMStack', () => {
  it('creates the correct CloudFormation template', () => {
    const app = new cdk.App()

    const stack = new IAMStack(app, 'iam')

    expectCDK(stack).to(haveResource('AWS::IAM::User'))
    expectCDK(stack).to(
      haveResource('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                'cloudformation:*',
                'budgets:*',
                's3:*',
                'iam:*',
                'cloudfront:*',
                'acm:*',
                'route53:*',
              ],
              Effect: 'Allow',
              Resource: '*',
            },
          ],
          Version: '2012-10-17',
        },
        PolicyName: 'StackDeploymentPolicy9FFBB8D3',
        Users: [
          {
            Ref: 'StackDeploymentUser07B4A228',
          },
        ],
      }),
    )
  })
})
