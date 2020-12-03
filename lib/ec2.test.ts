import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { EC2Stack } from './ec2'

describe('EC2Stack', () => {
  const app = new cdk.App()
  const stack = new EC2Stack(app, 'ec2')

  it('creates a VPC', () => {
    expectCDK(stack).to(haveResourceLike('AWS::EC2::VPC'))
  })

  it('creates an instance', () => {
    expectCDK(stack).to(haveResourceLike('AWS::EC2::Instance'))
  })

  it('creates an IAM role', () => {
    expectCDK(stack).to(haveResourceLike('AWS::IAM::Role'))
  })
})
