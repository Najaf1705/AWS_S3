import express from 'express';
import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 5000;

app.use(cors());
app.use(express.static('public'));

const s3client = new S3Client({
    region: process.env.AWS_REGION, // Get region from .env
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Get access key from .env
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Get secret key from .env
    },
});

app.get('/fetchPutObjectURL', async (req, res) => {
    console.log("Makise Kurisu");
    const { filename, contentType } = req.query;
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME, // Get the bucket name from .env
        Key: `uploads/user-uploads/${filename}`,
        ContentType: contentType,
    });
    try {
        const url = await getSignedUrl(s3client, command, { expiresIn: 3600 }); // URL expires in 1 hour
        res.json({ url });
    } catch (error) {
        res.status(500).send('Error generating pre-signed URL');
    }
});

app.get('/listImages', async (req, res) => {
    const listObjects = async () => {
        const command = new ListObjectsV2Command({
            Bucket: process.env.S3_BUCKET_NAME, // Get the bucket name from .env
            Prefix: 'uploads/user-uploads/',
        });

        const result = await s3client.send(command);
        console.log(result);
        return result;
    };

    try {
        const objectList = await listObjects();

        const keys = objectList.Contents ? objectList.Contents.map(item => item.Key) : [];

        async function getObjectURL(pathOfData) {
            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME, // Get the bucket name from .env
                Key: pathOfData,
            });
            const url = await getSignedUrl(s3client, command, { expiresIn: 3600 });
            return url;
        }

        const signedURLs = await Promise.all(keys.map(key => getObjectURL(key)));
        console.log(signedURLs);
        res.json({ signedURLs });
    } catch (error) {
        console.error("Error listing objects:", error);
        res.status(500).json({ error: "Failed to list objects" });
    }
});

app.delete('/deleteImage', async (req, res) => {
    const { imageURL } = req.query;
    const urlObject = new URL(imageURL);
    const pathname = urlObject.pathname;
    const key = pathname.replace(`/${process.env.S3_BUCKET_NAME}/`, ''); // Adjust bucket name accordingly
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME, // Get the bucket name from .env
            Key: key,
        });
        await s3client.send(command);
        res.status(200).json({ msg: "Image Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete Image" });
    }
});

app.listen(port, () => {
    console.log("Server running at port", port);
});
