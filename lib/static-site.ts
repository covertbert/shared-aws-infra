import { Stack, App, StackProps, RemovalPolicy, CfnOutput, Duration } from '@aws-cdk/core'
import { Bucket, BlockPublicAccess, BucketEncryption } from '@aws-cdk/aws-s3'
import {
  OriginAccessIdentity,
  CloudFrontWebDistributionProps,
  CloudFrontWebDistribution,
} from '@aws-cdk/aws-cloudfront'
import { PolicyStatement, CanonicalUserPrincipal } from '@aws-cdk/aws-iam'
import {
  ARecord,
  AaaaRecord,
  CnameRecord,
  MxRecord,
  TxtRecord,
  RecordTarget,
  PublicHostedZone,
} from '@aws-cdk/aws-route53'
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets'

type ExtendedStackProps = StackProps & {
  recordName: string
  domainName: string
  certificateARN: string
}
export class StaticSiteStack extends Stack {
  constructor(scope: App, id: string, props: ExtendedStackProps) {
    super(scope, id, props)

    const WEBSITE_NAME = id
    const ARTIFACT_BUCKET_NAME = `${WEBSITE_NAME}-artifacts`
    const { recordName, domainName, certificateARN } = props
    const fullApexDomain = [recordName, domainName].join('.')

    const websiteBucket = new Bucket(this, ARTIFACT_BUCKET_NAME, {
      bucketName: ARTIFACT_BUCKET_NAME,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
    })

    const cloudfrontOAI = new OriginAccessIdentity(this, 'OAI', {
      comment: `CloudFront OAI for ${WEBSITE_NAME}`,
    })

    const cloudfrontS3Access = new PolicyStatement({
      actions: ['s3:GetBucket*', 's3:GetObject*', 's3:List*'],
      resources: [websiteBucket.bucketArn, `${websiteBucket.bucketArn}/*`],
      principals: [
        new CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId),
      ],
    })

    websiteBucket.addToResourcePolicy(cloudfrontS3Access)

    const cloudfrontDistProps: CloudFrontWebDistributionProps = {
      aliasConfiguration: {
        acmCertRef: certificateARN,
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

    const www = new ARecord(this, 'WWWBertieDevARecord', {
      target: RecordTarget.fromAlias(new CloudFrontTarget(cloudfrontDist)),
      zone: hostedZone,
      recordName: fullApexDomain,
      ttl: Duration.seconds(60),
    })

    new ARecord(this, 'NakedBertieDevARecord', {
      target: RecordTarget.fromAlias(new CloudFrontTarget(cloudfrontDist)),
      zone: hostedZone,
      recordName: domainName,
      ttl: Duration.seconds(60),
    })

    new AaaaRecord(this, 'NakedBertieDevAAARecord', {
      target: RecordTarget.fromAlias(new CloudFrontTarget(cloudfrontDist)),
      zone: hostedZone,
      recordName: domainName,
      ttl: Duration.seconds(60),
    })

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
      domainName,
      zone: hostedZone,
      recordName: 'fm1.bertie.dev.dkim.fmhosted.com',
    })

    new CnameRecord(this, 'FastMailCNAME2', {
      domainName,
      zone: hostedZone,
      recordName: 'fm2.bertie.dev.dkim.fmhosted.com',
    })

    new CnameRecord(this, 'FastMailCNAME3', {
      domainName,
      zone: hostedZone,
      recordName: 'fm3.bertie.dev.dkim.fmhosted.com',
    })

    new CfnOutput(this, 'cloudfront-url', {
      exportName: 'CloudfrontURL',
      value: cloudfrontDist.distributionDomainName,
    })

    new CfnOutput(this, 'www-url', {
      exportName: 'wwwURL',
      value: www.domainName,
    })
  }
}
