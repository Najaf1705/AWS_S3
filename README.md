# AWS S3 Node.js Application

This project demonstrates how to integrate AWS S3 services with a Node.js backend and a frontend to perform basic operations like uploading files, fetching pre-signed URLs, listing bucket contents, and deleting objects.

---

## Features

- **Pre-Signed URL Generation**: Generate secure, time-limited URLs for uploading files to AWS S3.
- **File Upload**: Use pre-signed URLs to upload files directly to S3.
- **List Files**: Retrieve a list of objects in a specific S3 bucket folder along with their pre-signed URLs.
- **Delete Files**: Delete objects from the S3 bucket using pre-signed URLs.
- **Secure Configuration**: Environment variables are used to securely manage AWS credentials and bucket information.

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **AWS SDK**: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`
- **Frontend**: Vanilla JavaScript (for integration)
- **Environment Management**: `dotenv`
- **CORS**: Enabled for cross-origin requests.

---

## Prerequisites

Before running the project, ensure the following:

1. **Node.js Installed**: Version 14.x or higher.
2. **AWS Account**: Set up an S3 bucket and ensure the proper IAM user with necessary permissions.
3. **AWS CLI (Optional)**: Validate credentials and permissions using the AWS CLI.
   ```bash
   aws configure

  **The IAM user should have the following S3 permissions:**
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::<bucket-name>",
        "arn:aws:s3:::<bucket-name>/*"
      ]
    }
  ]
}
```

**.env**
```
AWS_REGION=ap-south-1 
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
S3_BUCKET_NAME=your_bucket_name
```
