import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { BudgetsStack } from './budgets'

describe('BudgetsStack', () => {
  const app = new cdk.App()
  const stack = new BudgetsStack(app, 'budgets')

  it('creates a 20USD budget', () => {
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
