import mongoose from 'mongoose';
import user from './user.js';


const schema = new mongoose.Schema({
	reciver: {type: mongoose.Schema.Types.ObjectId, ref: user},
    sender: {type: mongoose.Schema.Types.ObjectId, ref: user},
	amount: {type: Number, required: false}, 
},{timestamps: true});



export default mongoose.model('coinhistory', schema);