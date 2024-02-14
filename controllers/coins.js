import catchAsyncError from '../middlewares/catchAsyncError.js';
import UserModel from '../models/user.js';
import coinshistoryModel from '../models/coinshitory.js';

import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url))

export const sendCoin = catchAsyncError(async (req, res) => {
    const {reciveId,senderId,amount} = req.body;

    const reciver = await UserModel.findById(reciveId);
    const sender = await UserModel.findById(senderId);

    let senderCoinRef = JSON.parse(JSON.stringify(sender.coins));
    let reciverCoinRef = JSON.parse(JSON.stringify(reciver.coins));

    if(!reciver || !sender) return res.status(404).json({success: false,message: "invalid reciver or sender id"});
    if(sender.coins < amount) return res.status(404).json({success: false,message: "you not have enough amount"});
    if(senderId.toString() != req.user._id.toString()) return res.status(404).json({success: false,message: "user or sender id does not match"});

	try {
        // cut coins from sender 
        sender.coins = sender.coins - amount;
         // send coins from recive 
        reciver.coins = reciver.coins + amount;
        await sender.save();
        await reciver.save();
        res.status(200).json({
            success: true,
            message: 'send successfully'
        })

        await coinshistoryModel.create({reciver: reciveId,sender: senderId,amount});
    } catch (error) {
        sender.coins = senderCoinRef;
        reciver.coins = reciverCoinRef;
        await sender.save();
        await reciver.save();

        res.status(501).json({
            success: false,
            message: 'something wants wrong'
        })
    }
});
