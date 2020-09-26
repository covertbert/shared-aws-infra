import { Stack, App, StackProps } from '@aws-cdk/core'
import { PublicHostedZone } from '@aws-cdk/aws-route53'

export class Route53Stack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    new PublicHostedZone(this, 'BertieDevZone', { zoneName: 'bertie.dev' })
  }
}
