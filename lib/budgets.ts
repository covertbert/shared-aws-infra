import { Stack, App, StackProps } from '@aws-cdk/core'
import { CfnBudget } from '@aws-cdk/aws-budgets'

export class BudgetsStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    new CfnBudget(this, 'CostBudget', {
      budget: {
        budgetName: 'CostBudget',
        budgetType: 'COST',
        budgetLimit: {
          amount: 20,
          unit: 'USD',
        },
        timeUnit: 'MONTHLY',
      },
      notificationsWithSubscribers: [
        {
          notification: {
            comparisonOperator: 'GREATER_THAN',
            notificationType: 'FORECASTED',
            threshold: 90,
            thresholdType: 'PERCENTAGE',
          },
          subscribers: [{ address: 'blackmangh@gmail.com', subscriptionType: 'EMAIL' }],
        },
      ],
    })
  }
}
