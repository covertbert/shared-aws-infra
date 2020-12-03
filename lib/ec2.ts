import { Stack, App, StackProps } from '@aws-cdk/core'

export class EC2Stack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)
  }
}
