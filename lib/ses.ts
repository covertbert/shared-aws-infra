import { Stack, App, StackProps } from '@aws-cdk/core'
import { ReceiptRuleSet } from '@aws-cdk/aws-ses'
import { S3 } from '@aws-cdk/aws-ses-actions'
import { Bucket } from '@aws-cdk/aws-s3'

export class SESStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const BUCKET_NAME = `${id}-emails`

    const bucket = new Bucket(this, 'SESBucket', {
      bucketName: BUCKET_NAME,
    })

    new ReceiptRuleSet(this, 'SESRuleSet', {
      receiptRuleSetName: `${id}-rule-set`,
      rules: [
        {
          enabled: true,
          receiptRuleName: `${id}-s3-rule`,
          actions: [
            new S3({
              bucket,
              objectKeyPrefix: 'emails/',
            }),
          ],
        },
      ],
    })
  }
}
