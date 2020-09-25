import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { IAMStack } from '../lib'

describe('IAMStack', () => {
  it('creates the correct CloudFormation template', () => {
    const app = new cdk.App()

    const stack = new IAMStack(app, 'IAMStack')

    const expectedResult = {
      Resources: {
        StackDeploymentUser07B4A228: {
          Type: 'AWS::IAM::User',
          Properties: {
            UserName: 'StackDeploymentUser',
          },
        },
        StackDeploymentPolicy9FFBB8D3: {
          Type: 'AWS::IAM::Policy',
          Properties: {
            PolicyDocument: {
              Statement: [
                {
                  Action: ['cloudformation:*', 'budgets:*'],
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
          },
        },
      },
    }

    expectCDK(stack).to(matchTemplate(expectedResult, MatchStyle.EXACT))
  })
})
