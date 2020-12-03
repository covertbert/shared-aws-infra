import { Stack, App, StackProps, CfnOutput } from '@aws-cdk/core'
import {
  Vpc,
  Instance,
  InstanceType,
  AmazonLinuxImage,
  CloudFormationInit,
  InitConfig,
  InitPackage,
  InitCommand,
  SecurityGroup,
  Peer,
  Port,
  SubnetType,
} from '@aws-cdk/aws-ec2'

export class EC2Stack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const vpc = new Vpc(this, 'EC2VPC')

    const instanceType = new InstanceType('t2.micro')

    const machineImage = new AmazonLinuxImage()

    const securityGroup = new SecurityGroup(this, 'EC2SecurityGroup', {
      vpc,
      description: 'Allow ssh access to ec2 instances',
      allowAllOutbound: true,
    })

    securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(22), 'allow ssh access from the world')

    const instance = new Instance(this, 'EC2Instance', {
      vpc,
      instanceType,
      machineImage,
      keyName: 'main-beast',
      securityGroup,
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
      init: CloudFormationInit.fromConfigSets({
        configSets: {
          default: ['yumPreinstall', 'config'],
        },
        configs: {
          yumPreinstall: new InitConfig([
            InitPackage.yum('git'),
            InitPackage.yum('zsh'),
            InitPackage.yum('util-linux-user'),
          ]),
          config: new InitConfig([
            InitCommand.shellCommand('yum update'),
            InitCommand.shellCommand('sudo chsh -s $(which zsh)'),
            // InitFile.fromString(
            //   '~/.ssh/authorized_keys',
            //   'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDHeqYWB4dlN9LM3GpFRz7coqvmPp+oZzY6HmaODJHOX5h+PZWR2V/EdMKqT4crQXZ+iegc+un+NrnpuxJC0w9ZHzgNPTaYY7aavnoUiRB5m9cHYDqL9O+69rp8PNxrpT/fBZONmBiTUJCKqlb+OigDcdECGK6ebgNMLskJ1uSzhp1x1VM3a2koQTFJuJ1M5irUPB3zLaGbsQW8D60MkaXsHPToA/yh+CJdKkYTB+T4Y/JhiY/sIRBLg3ijaLEDzCf5jBfhJNB8amPC3OWDiJe/E9kmdx+18KQDu/d5aBbp6UL4fOVnjKS+HXMWqFs131LNEB2KdHccTZjWxgiwLFpC/DQ7tKswTULEYe1/ZRSOJi+yXMMIYrY5jsYmhhyG7HWRbZkqN5vdlLMB1rQrM+uugv9hNCa1d3lbRh1HqVxESRrcGtVJi1ZBSqSOUI66qfm6Nb1/F45NQDqNKHMK94d3RC0ErHSkCnhkBI5fs4E9enlYz3LoXvQa2ngJNCes7CxWCZ0/JEt9IH9zVPztuPRp+aVSZmDLBDG10wh/9KQ8IIjBID2/+rboTNe7KK/phNw/VSUh53avcnbe9UVDdQevwbbzjQloiiNYyJK1ehsrFcm4k/7iWMyZpAPB8/8SxbMu62g+HweNxSlsLKKRLJCbF8IwQ8vgPLk/zb8jXP2gxw== bertie.blackman@cinch.co.uk',
            // ),
          ]),
        },
      }),
    })

    new CfnOutput(this, 'ec2-public-ip', {
      value: instance.instancePublicIp,
      exportName: 'publicIP',
      description: 'The public IP address of the EC2 instance',
    })
  }
}
