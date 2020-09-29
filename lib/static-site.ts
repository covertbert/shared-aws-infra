import { Stack, App, StackProps, RemovalPolicy, CfnOutput } from '@aws-cdk/core'
import { Bucket } from '@aws-cdk/aws-s3'
import {
  OriginAccessIdentity,
  CloudFrontWebDistributionProps,
  CloudFrontWebDistribution,
} from '@aws-cdk/aws-cloudfront'
import { PolicyStatement, CanonicalUserPrincipal } from '@aws-cdk/aws-iam'
import { ARecord, RecordTarget, PublicHostedZone } from '@aws-cdk/aws-route53'
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets'

type ExtendedStackProps = StackProps & {
  recordName: string
  domainName: string
}
export class StaticSiteStack extends Stack {
  constructor(scope: App, id: string, props: ExtendedStackProps) {
    super(scope, id, props)

    const WEBSITE_NAME = id
    const ARTIFACT_BUCKET_NAME = `${WEBSITE_NAME}-artifacts`
    const { recordName, domainName } = props
    const fullApexDomain = [recordName, domainName].join('.')

    const websiteBucket = new Bucket(this, ARTIFACT_BUCKET_NAME, {
      bucketName: ARTIFACT_BUCKET_NAME,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const cloudfrontOAI = new OriginAccessIdentity(this, 'OAI', {
      comment: `CloudFront OAI for ${WEBSITE_NAME}`,
    })

    const cloudfrontDistProps: CloudFrontWebDistributionProps = {
      aliasConfiguration: {
        acmCertRef:
          'arn:aws:acm:us-east-1:515213366596:certificate/904b7400-ca9a-4f45-8f77-91deccfd79c1',
        names: [domainName, fullApexDomain],
      },
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: websiteBucket,
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

    const hostedZone = new PublicHostedZone(this, 'BertieDevZone', { zoneName: domainName })

    new ARecord(this, 'WWWBertieDevARecord', {
      target: RecordTarget.fromAlias(new CloudFrontTarget(cloudfrontDist)),
      zone: hostedZone,
      recordName: fullApexDomain,
    })

    new ARecord(this, 'NakedBertieDevARecord', {
      target: RecordTarget.fromAlias(new CloudFrontTarget(cloudfrontDist)),
      zone: hostedZone,
      recordName: domainName,
    })

    const cloudfrontS3Access = new PolicyStatement({
      actions: ['s3:GetBucket*', 's3:GetObject*', 's3:List*'],
      resources: [websiteBucket.bucketArn, `${websiteBucket.bucketArn}/*`],
      principals: [
        new CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId),
      ],
    })

    websiteBucket.addToResourcePolicy(cloudfrontS3Access)

    new CfnOutput(this, 'cloudfront-url', {
      exportName: 'CloudfrontURL',
      value: cloudfrontDist.distributionDomainName,
    })
  }
}
