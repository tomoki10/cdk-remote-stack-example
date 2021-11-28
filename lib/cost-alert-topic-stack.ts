import * as cdk from "@aws-cdk/core";
import * as sns from "@aws-cdk/aws-sns";

export interface CostAlertTopicStackProps extends cdk.StackProps {
  costNotifyEmail: string;
}

export class CostAlertTopicStack extends cdk.Stack {
  public readonly alarmTopic: sns.Topic;

  constructor(scope: cdk.Construct, id: string, props: CostAlertTopicStackProps) {
    super(scope, id, props);

    const alarmTopic = new sns.Topic(this, `${id}-CostAlarmTopic`);
    new sns.Subscription(this, `${id}-CostAlarmEmail`, {
      endpoint: props.costNotifyEmail,
      protocol: sns.SubscriptionProtocol.EMAIL,
      topic: alarmTopic,
    });
    this.alarmTopic = alarmTopic;
  }
}
