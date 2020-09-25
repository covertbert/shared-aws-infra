import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { BudgetsStack } from '../lib'

describe('BudgetsStack', () => {
  it('creates the correct CloudFormation template', () => {
    const app = new cdk.App()

    const stack = new BudgetsStack(app, 'budgets')

    expectCDK(stack).to(
      haveResource('AWS::Budgets::Budget', {
        Budget: {
          BudgetLimit: {
            Amount: 20,
            Unit: 'USD',
          },
          BudgetName: 'CostBudget',
          BudgetType: 'COST',
          TimeUnit: 'MONTHLY',
        },
      }),
    )
  })
})
