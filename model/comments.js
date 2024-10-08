const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const CommentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    blogId:{
        type: Schema.Types.ObjectId,
        ref: "Blog"
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})

const CommentModel = mongoose.model("comment", CommentSchema)

module.exports = CommentModel