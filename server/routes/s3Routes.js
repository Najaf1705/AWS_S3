import express from 'express';
import {getPutObjectURL, getObjectURL, listObjects, deleteObject} from '../services/s3Services.js';

const router=express.Router();

router.get('/upload',async (req,res)=>{
    console.log("Makise Kurisu");
    const {filename, contentType}=req.query;
    try {
        const url = await getPutObjectURL(process.env.S3_BUCKET_NAME, `uploads/user-uploads/${filename}`, contentType);
        res.json({ url });
    } catch (error) {
        console.error("Error generating pre-signed URL:", error);
        res.status(500).send('Error generating pre-signed URL');
    }
});


router.get('/images',async(req,res)=>{
    try {
        const objectList = await listObjects(process.env.S3_BUCKET_NAME, 'uploads/user-uploads/');
        const keys = objectList.Contents ? objectList.Contents.map(item => item.Key) : [];
        
        const signedURLs=await Promise.all(keys.map(key=>getObjectURL(process.env.S3_BUCKET_NAME, key)));
        res.json({ signedURLs });
    } catch (error) {
        res.status(500).json({ error: "Failed to list objects" });
    }
});

router.delete('/delete',async(req,res)=>{
    const {imageURL}=req.query;
    const urlObject = new URL(imageURL);
    const pathname = urlObject.pathname;
    const key = pathname.replace(`/${process.env.S3_BUCKET_NAME}/`, '');
    try {
        deleteObject(process.env.S3_BUCKET_NAME, key);
        res.status(200).json({msg:"Image Deleted succesfully"});
    } catch (error) {
        res.status(500).json({error:"Failed to delete Image"});
    }
});

export default router;