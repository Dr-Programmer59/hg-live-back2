import catchAsyncError from '../middlewares/catchAsyncError.js';
import StreamModel from '../models/streams.js'; 
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import getDataUri from '../utils/dataUri.js';
const __dirname = dirname(fileURLToPath(import.meta.url))
import fs from 'fs'

export const createStream = catchAsyncError(async (req, res) => {
    
	const {title} = req.body;
    

    if(!title || !req.file) return res.status(401).json({success: false,message: "all fields are required"});
    
    
		const base64 = getDataUri(req.file);
		const filename = `${new Date(Date.now()).getTime()}-${req.file.originalname}${base64.fileName}`
	    fs.writeFileSync(path.join(__dirname,`../public/upload/images/${filename}`),base64.buffer,'binary');
		let banner = `/upload/images/${filename}`;

    const stream = await StreamModel.create({title,owner: req.user._id,banner});
    
    res.status(200).json({
        success: true,
        roomId: stream._id
    })
	
});

export const updateStream = catchAsyncError(async (req, res) => {
	const {id} = req.params;

    const stream = await StreamModel.findByIdAndUpdate(id,{...req.body});

    res.status(200).json({
        success: true,
        message: "update successfully"
    })
	
});

export const getLiveStream = catchAsyncError(async (req, res) => {

    const streams = await StreamModel.find({status: "processing"});

    res.status(200).json({
        success: true,
        streams
    })
	
});


export const getStreamDetails = catchAsyncError(async (req, res) => {
	const {id} = req.params;

    const stream = await StreamModel.findById(id).populate('owner');

    res.status(200).json({
        success: true,
        stream
    })
	
});