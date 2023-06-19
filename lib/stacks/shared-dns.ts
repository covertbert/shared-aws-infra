import { Stack, App, StackProps } from '@aws-cdk/core'
import { CnameRecord, MxRecord, TxtRecord, PublicHostedZone } from '@aws-cdk/aws-route53'

export class SharedDnsStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const domainName = 'bertie.dev'
    const hostedZone = new PublicHostedZone(this, 'BertieDevZone', { zoneName: domainName })

    new MxRecord(this, 'FastMailMX', {
      recordName: domainName,
      zone: hostedZone,
      values: [
        {
          priority: 10,
          hostName: 'in1-smtp.messagingengine.com',
        },
        {
          priority: 20,
          hostName: 'in2-smtp.messagingengine.com',
        },
      ],
    })

    new TxtRecord(this, 'FastMailTXT', {
      recordName: domainName,
      zone: hostedZone,
      values: ['v=spf1 include:spf.messagingengine.com ?all'],
    })

    new CnameRecord(this, 'FastMailCNAME1', {
      domainName: 'fm1.bertie.dev.dkim.fmhosted.com',
      zone: hostedZone,
      recordName: 'fm1._domainkey',
    })

    new CnameRecord(this, 'FastMailCNAME2', {
      domainName: 'fm2.bertie.dev.dkim.fmhosted.com',
      zone: hostedZone,
      recordName: 'fm2._domainkey',
    })

    new CnameRecord(this, 'FastMailCNAME3', {
      domainName: 'fm3.bertie.dev.dkim.fmhosted.com',
      zone: hostedZone,
      recordName: 'fm3._domainkey',
    })
  }
}
