import mongoose from 'mongoose';
import user from './user.js';


const schema = new mongoose.Schema({
	title: {type: String, required: true},
    banner: {type: String,required: true},
	views: {type: Number, required: false},
	status: {type: String,default: "processing",enum:['processing','complete']},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: user}],
    dislikes: [{type: mongoose.Schema.Types.ObjectId, ref: user}],
    owner: {type: mongoose.Schema.Types.ObjectId, ref: user,required: true},
    videsouce:{type: String,default: undefined}
},{timestamps: true});



export default mongoose.model('stream', schema);