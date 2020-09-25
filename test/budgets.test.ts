import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { BudgetsStack } from '../lib'

describe('BudgetsStack', () => {
  it('creates the correct CloudFormation template', () => {
    const app = new cdk.App()

    const stack = new BudgetsStack(app, 'BudgetsStack')

    const expectedResult = {
      Resources: {
        CostBudget: {
          Type: 'AWS::Budgets::Budget',
          Properties: {
            Budget: {
              BudgetLimit: {
                Amount: 20,
                Unit: 'USD',
              },
              BudgetName: 'CostBudget',
              BudgetType: 'COST',
              TimeUnit: 'MONTHLY',
            },
            NotificationsWithSubscribers: [
              {
                Notification: {
                  ComparisonOperator: 'GREATER_THAN',
                  NotificationType: 'FORECASTED',
                  Threshold: 90,
                  ThresholdType: 'PERCENTAGE',
                },
                Subscribers: [
                  {
                    Address: 'blackmangh@gmail.com',
                    SubscriptionType: 'EMAIL',
                  },
                ],
              },
            ],
          },
        },
      },
    }

    expectCDK(stack).to(matchTemplate(expectedResult, MatchStyle.EXACT))
  })
})
