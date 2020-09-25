import { Stack, App, StackProps, RemovalPolicy, CfnOutput } from '@aws-cdk/core'
import { Bucket } from '@aws-cdk/aws-s3'
import {
  OriginAccessIdentity,
  CloudFrontWebDistributionProps,
  CloudFrontWebDistribution,
} from '@aws-cdk/aws-cloudfront'
import { PolicyStatement, CanonicalUserPrincipal } from '@aws-cdk/aws-iam'

export class StaticSiteStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const WEBSITE_NAME = id
    const BUCKET_NAME = `${id}-artifacts`

    const bucket = new Bucket(this, BUCKET_NAME, {
      bucketName: BUCKET_NAME,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const cloudfrontOAI = new OriginAccessIdentity(this, 'OAI', {
      comment: `CloudFront OAI for ${WEBSITE_NAME}`,
    })

    const cloudfrontDistProps: CloudFrontWebDistributionProps = {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: cloudfrontOAI,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    }

    const cloudfrontDist = new CloudFrontWebDistribution(
      this,
      `${WEBSITE_NAME}-cfd`,
      cloudfrontDistProps,
    )

    const cloudfrontS3Access = new PolicyStatement({
      actions: ['s3:GetBucket*', 's3:GetObject*', 's3:List*'],
      resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
      principals: [
        new CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId),
      ],
    })

    bucket.addToResourcePolicy(cloudfrontS3Access)

    new CfnOutput(this, 'cloudfront-url', {
      exportName: 'CloudfrontURL',
      value: cloudfrontDist.distributionDomainName,
    })
  }
}
