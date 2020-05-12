# ses-notifications

A lambda that processes SES messages into expiring DynamoDB items 

This lambda is installed in bcic prod account and hooked up to the SES notification streams

The Lambda:
https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/sesnotificationscode?tab=configuration

The DynamoDB table
https://console.aws.amazon.com/dynamodb/home?region=us-east-1#tables:selected=SESNotifications;tab=overview

# Testing

To manually test email out through the server

Collect the username and password from Lastpass "Production SMTP / SES User" entry

```
export SES_USER_ENC=$(echo -n "USERNAME" | openssl enc -base64)
export SES_PW_ENC=$(echo -n "PASSWORD" | openssl enc -base64)

envsubst < tests/test.bounce | openssl s_client -crlf -quiet -starttls smtp -connect email-smtp.us-east-1.amazonaws.com:587 
envsubst < tests/test.deliver | openssl s_client -crlf -quiet -starttls smtp -connect email-smtp.us-east-1.amazonaws.com:587 
envsubst < tests/test.complaint | openssl s_client -crlf -quiet -starttls smtp -connect email-smtp.us-east-1.amazonaws.com:587 
```

# Validating SPF/DKIM

Go to this website https://www.mail-tester.com and mark down the email address that gets generated for you.

Make a copy of one of the test files:

`cp test.deliver /tmp/test.mt`

Modify the `RCPT TO:` and `To:` lines in the file to be the address from the mail-tester website and execute (you must have the SES_* env vars set):

```
envsubst < /tmp/test.mt | openssl s_client -crlf -quiet -starttls smtp -connect email-smtp.us-east-1.amazonaws.com:587 
```

Then proceed on the website to see an analysis of the sending environment.