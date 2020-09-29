import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { CertificatesStack } from './certificates'

describe('CertificatesStack', () => {
  const app = new cdk.App()
  const stack = new CertificatesStack(app, 'certificates')

  it('creates a certificate with wildcard subdomain for bertie.dev', () => {
    expectCDK(stack).to(
      haveResource('AWS::CertificateManager::Certificate', {
        DomainName: 'bertie.dev',
        SubjectAlternativeNames: ['*.bertie.dev'],
        ValidationMethod: 'DNS',
      }),
    )
  })
})
