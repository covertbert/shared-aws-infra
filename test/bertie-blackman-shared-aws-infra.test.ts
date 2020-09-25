import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as BertieBlackmanSharedAwsInfra from '../lib/budgets'

test('Empty Stack', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new BertieBlackmanSharedAwsInfra.BudgetsStack(app, 'MyTestStack')
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT,
    ),
  )
})
