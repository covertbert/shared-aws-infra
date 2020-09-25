import { Stack, App, StackProps, Duration } from '@aws-cdk/core'
import { Bucket } from '@aws-cdk/aws-s3'

export class S3Stack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    new Bucket(this, 'BertieBlackmanBucket', {
      bucketName: 'bertie-blackman-artifacts',
      lifecycleRules: [{ expiration: Duration.days(30) }],
    })
  }
}
