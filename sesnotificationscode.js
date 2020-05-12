console.log("Loading event");
var aws = require("aws-sdk");
var ddb = new aws.DynamoDB({ params: { TableName: "SESNotifications" } });

exports.handler = function (event, context) {
  console.log("Received event:", JSON.stringify(event, null, 2));
  var SnsPublishTime = event.Records[0].Sns.Timestamp;
  var SnsTopicArn = event.Records[0].Sns.TopicArn;
  var SESMessage = event.Records[0].Sns.Message;
  SESMessage = JSON.parse(SESMessage);
  var SESMessageType = SESMessage.notificationType;
  var SESMessageId = SESMessage.mail.messageId;
  var SESDestinationAddress = SESMessage.mail.destination.toString();
  var LambdaReceiveTime = new Date().toString();

  //Set TTL to 1 year
  var aYearFromNow = new Date();
  aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
  var ttl = parseInt(aYearFromNow.getTime() / 1000).toString();
  if (SESMessageType == "Bounce") {
    var SESreportingMTA = SESMessage.bounce.reportingMTA;
    var SESbounceSummary = JSON.stringify(SESMessage.bounce.bouncedRecipients);
    var itemParams = {
      Item: {
        SESMessageId: { S: SESMessageId },
        SnsPublishTime: { S: SnsPublishTime },
        SESreportingMTA: { S: SESreportingMTA },
        SESDestinationAddress: { S: SESDestinationAddress },
        SESbounceSummary: { S: SESbounceSummary },
        SESMessageType: { S: SESMessageType },
        ExpireTime: { N: ttl }
      },
    };
    ddb.putItem(itemParams, function (err, data) {
      if (err) {
        context.fail(err);
      } else {
        console.log(data);
        context.succeed();
      }
    });
  } else if (SESMessageType == "Delivery") {
    var SESsmtpResponse1 = SESMessage.delivery.smtpResponse;
    var SESreportingMTA1 = SESMessage.delivery.reportingMTA;
    var itemParamsdel = {
      Item: {
        SESMessageId: { S: SESMessageId },
        SnsPublishTime: { S: SnsPublishTime },
        SESsmtpResponse: { S: SESsmtpResponse1 },
        SESreportingMTA: { S: SESreportingMTA1 },
        SESDestinationAddress: { S: SESDestinationAddress },
        SESMessageType: { S: SESMessageType },
        ExpireTime: { N: ttl }
      },
    };
    ddb.putItem(itemParamsdel, function (err, data) {
      if (err) {
        context.fail(err);
      } else {
        console.log(data);
        context.succeed();
      }
    });
  } else if (SESMessageType == "Complaint") {
    var SESComplaintFeedbackType = SESMessage.complaint.complaintFeedbackType;
    var SESFeedbackId = SESMessage.complaint.feedbackId;
    var itemParamscomp = {
      Item: {
        SESMessageId: { S: SESMessageId },
        SnsPublishTime: { S: SnsPublishTime },
        SESComplaintFeedbackType: { S: SESComplaintFeedbackType },
        SESFeedbackId: { S: SESFeedbackId },
        SESDestinationAddress: { S: SESDestinationAddress },
        SESMessageType: { S: SESMessageType },
        ExpireTime: { N: ttl }
      },
    };
    ddb.putItem(itemParamscomp, function (err, data) {
      if (err) {
        context.fail(err);
      } else {
        console.log(data);
        context.succeed();
      }
    });
  }
};
