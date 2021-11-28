# cdk-remote-stack example

This repository is sample implementation of cdk-remote-stack. cdk-remote-stack is a service that enables cross-stack references between regions, etc.

Check the repository below for details.

[cdk-remote-stack](https://github.com/pahud/cdk-remote-stack)

## Example Contents

In this sample, I will use Budget Alert in us-east-1 region to refer to SNS Topic in ap-northeast-1 region.

### Bootstrap

If you have not yet configured bootstrap for each region, use the following command to do so. `123456789012` is a AWS account ID.

```
% npx cdk bootstrap aws://123456789012/ap-northeast-1 -c environment=dev
% npx cdk bootstrap aws://123456789012/us-east-1 -c environment=dev
```

### Deploy

```
% npx cdk deploy --all -c environment=dev --require-approval never
```
