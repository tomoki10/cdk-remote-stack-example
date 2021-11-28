import * as cdk from "@aws-cdk/core";
import * as budgets from "@aws-cdk/aws-budgets";
import { RemoteParameters } from "cdk-remote-stack";

export interface CostAlertStackProps extends cdk.StackProps {
  costAlertTopicParam: string;
  costAlertTopicRegion: string;
}

export class CostAlertStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: CostAlertStackProps) {
    super(scope, id, props);

    const parameters = new RemoteParameters(this, `${id}-Parameters`, {
      path: props.costAlertTopicParam,
      region: props.costAlertTopicRegion,
    });
    const alertTopicArn = parameters.get(`${props.costAlertTopicParam}/topicArn`);

    // Budgets Alert
    new budgets.CfnBudget(this, `${id}-BillingAlarmBudget`, {
      budget: {
        budgetType: "COST",
        timeUnit: "DAILY",
        budgetLimit: {
          unit: "USD",
          amount: 100,
        },
      },
      notificationsWithSubscribers: [
        {
          notification: {
            comparisonOperator: "GREATER_THAN",
            notificationType: "ACTUAL",
            threshold: 80,
            thresholdType: "PERCENTAGE",
          },
          subscribers: [
            {
              subscriptionType: "SNS",
              address: alertTopicArn,
            },
          ],
        },
      ],
    });
  }
}
