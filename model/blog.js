const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    coverImageUrl:{
        type:String,
        required:true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
},{timestamps:true})

const BlogModel = mongoose.model("Blog", blogSchema)

module.exports = BlogModel