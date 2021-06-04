import { Stack, App, StackProps } from '@aws-cdk/core'
import { CnameRecord, MxRecord, TxtRecord, PublicHostedZone } from '@aws-cdk/aws-route53'

type ExtendedStackProps = StackProps & {
  recordName: string
  domainName: string
  certificateARN: string
}

export class SharedDnsStack extends Stack {
  public readonly hostedZone: PublicHostedZone

  constructor(scope: App, id: string, props: ExtendedStackProps) {
    super(scope, id, props)

    const { domainName } = props

    this.hostedZone = new PublicHostedZone(this, 'BertieDevZone', { zoneName: domainName })

    new MxRecord(this, 'FastMailMX', {
      recordName: domainName,
      zone: this.hostedZone,
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
      zone: this.hostedZone,
      values: ['v=spf1 include:spf.messagingengine.com ?all'],
    })

    new CnameRecord(this, 'FastMailCNAME1', {
      domainName,
      zone: this.hostedZone,
      recordName: 'fm1.bertie.dev.dkim.fmhosted.com',
    })

    new CnameRecord(this, 'FastMailCNAME2', {
      domainName,
      zone: this.hostedZone,
      recordName: 'fm2.bertie.dev.dkim.fmhosted.com',
    })

    new CnameRecord(this, 'FastMailCNAME3', {
      domainName,
      zone: this.hostedZone,
      recordName: 'fm3.bertie.dev.dkim.fmhosted.com',
    })
  }
}
