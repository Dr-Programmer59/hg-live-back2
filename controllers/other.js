import catchAsyncError from '../middlewares/catchAsyncError.js';
import UserModel from '../models/user.js'; 
import { getPrayHtml } from '../utils/getResetPasswordHtml.js';
import sendEmail from '../utils/sendEmail.js';

export const getAllChannels = catchAsyncError(async (req, res) => {
    const {channelName} = req.query;
    const channels = await UserModel.find({role: 'streamer',channelName: new RegExp(channelName,'i')});

    res.status(200).json({success: true,channels});
});


export const getSingleChannels = catchAsyncError(async (req, res) => {
    const {_id} = req.params;
    const channel = await UserModel.findById(_id);
    res.status(200).json({success: true,channel});
});


export const prayRequest = catchAsyncError(async (req, res) => {
    const {reciverId,message,subject} = req.body;


    
    const sender = await UserModel.findById(req.user._id);
    const reciver = await UserModel.findById(reciverId);

    const html = getPrayHtml(sender?.name,subject,message,sender.email);
    
    console.log(reciver.email)
    await sendEmail(reciver.email, "HG Streaming Praying Request", message,html);
    res.status(200).json({success: true,message: "Request Send successful"});
});
