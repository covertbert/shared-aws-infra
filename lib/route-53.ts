import { Stack, App, StackProps } from '@aws-cdk/core'
import {
  PublicHostedZone,
  ARecord,
  AddressRecordTarget,
  AliasRecordTargetConfig,
} from '@aws-cdk/aws-route53'

export class Route53Stack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const hostedZone = new PublicHostedZone(this, 'BertieDevZone', { zoneName: 'bertie.dev' })

    new ARecord(this, 'BertieDevARecord', {
      target: AddressRecordTarget.fromAlias({
        bind: (): AliasRecordTargetConfig => ({
          dnsName: 'd1o1jqyrcd342e.cloudfront.net',
          hostedZoneId: 'Z2FDTNDATAQYW2', // CloudFront Zone ID
        }),
      }),
      zone: hostedZone,
      recordName: 'www.bertie.dev',
    })
  }
}
