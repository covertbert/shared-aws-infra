import { Stack, App, StackProps } from '@aws-cdk/core'
import { Certificate, ValidationMethod } from '@aws-cdk/aws-certificatemanager'

export class CertificatesStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    new Certificate(this, 'bertie-blackman', {
      domainName: 'bertie.dev',
      subjectAlternativeNames: ['*.bertie.dev'],
      validationMethod: ValidationMethod.DNS,
    })
  }
}
