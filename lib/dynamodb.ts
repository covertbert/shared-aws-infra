import { Stack, App, StackProps } from '@aws-cdk/core'
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb'

export class DynamoStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    new Table(this, `${id}-table`, {
      tableName: `${id}-table`,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
    })
  }
}
