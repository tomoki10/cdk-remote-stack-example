#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import * as ssm from "@aws-cdk/aws-ssm";

import { CostAlertTopicStack } from "../lib/cost-alert-topic-stack";
import { CostAlertStack } from "../lib/cost-alert-stack";

const app = new cdk.App();
const envKey = app.node.tryGetContext("environment");
const envVals = app.node.tryGetContext(envKey);

// Cost Topic
const costAlertTopicStack = new CostAlertTopicStack(app, `CostAlertTopicStack`, {
  costNotifyEmail: envVals.costNotifyEmail,
});

const parameterPath = `/${envVals.env.accountId}/${envVals.env.region}/${costAlertTopicStack.stackName}`;

new ssm.StringParameter(costAlertTopicStack, `TopicArn`, {
  parameterName: `${parameterPath}/topicArn`,
  stringValue: costAlertTopicStack.alarmTopic.topicArn,
});

// Cost Monitoring
const costAlertStack = new CostAlertStack(app, `CostAlarmStack`, {
  costAlertTopicParam: parameterPath,
  costAlertTopicRegion: envVals.env.region,
  env: { account: envVals.env.accountId, region: "us-east-1" },
});
costAlertStack.addDependency(costAlertTopicStack);
