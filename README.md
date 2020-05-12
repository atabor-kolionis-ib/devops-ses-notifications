# ses-notifications

A lambda that processes SES messages into expiring DynamoDB items 

This lambda is installed in bcic prod and hooked up to the SES notification streams

# Testing

To manually test email out through the server

Collect the username and password from Lastpass "Production SMTP / SES User" entry

export SES_USER_ENC=$(echo -n "USERNAME" | openssl enc -base64)
export SES_PW_ENC=$(echo -n "PASSWORD" | openssl enc -base64)

envsubst < tests/test.bounce | openssl s_client -crlf -quiet -starttls smtp -connect email-smtp.us-east-1.amazonaws.com:587 
envsubst < tests/test.deliver | openssl s_client -crlf -quiet -starttls smtp -connect email-smtp.us-east-1.amazonaws.com:587 
envsubst < tests/test.complaint | openssl s_client -crlf -quiet -starttls smtp -connect email-smtp.us-east-1.amazonaws.com:587 
