import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import dotenv from 'dotenv';
dotenv.config();

const s3client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export const getPutObjectURL=async (bucket,key,contentType)=>{
    const command=new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
    });

    return await getSignedUrl(s3client, command, { expiresIn: 3600 });
};

export const listObjects = async (bucket, prefix) => {
    const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
    });
    const result = await s3client.send(command);
    return result;
};

export const getObjectURL=async(bucket, pathOfData)=>{
    const command=new GetObjectCommand({
        Bucket: bucket,
        Key: pathOfData,
    });
    return await getSignedUrl(s3client, command, { expiresIn: 3600 });
};

export const deleteObject=async(bucket, key)=>{
    const command=new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
    });
    await s3client.send(command);
};