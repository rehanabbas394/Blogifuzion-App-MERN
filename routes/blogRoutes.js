const { Router } = require("express");
const router = Router();
const BlogModel = require("../model/blog");
const CommentModel =require("../model/comments")
const multer = require("multer")
const path = require("path")
const { formatDistanceToNow } = require('date-fns');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`))
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`
    cb(null, filename)
  }
})

const uploads = multer({ storage: storage })


router.get('/add', async (req, res) => {
  return res.render("blog", {
    user: req.user
  });
});

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const Blogs = await BlogModel.findById(id).populate("createdBy")
  const comments = await CommentModel.find({
    blogId:req.params.id
  }).populate("createdBy")

  const commentsWithTimeAgo = comments.map(comment => { 
    return {
      ...comment._doc, 
      timeAgo: formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
    };
  });

  console.log('Comments with time ago:', commentsWithTimeAgo);
  return res.render("blogView", {
    user: req.user,
    blog: Blogs,
    comments:commentsWithTimeAgo
  })
})

router.post('/add', uploads.single("coverImageUrl"), async (req, res) => {
  const { title, body, coverImageUrl, createdBy } = req.body

  await BlogModel.create({
    title,
    body,
    coverImageUrl: `/uploads/${req.file.filename}`,
    createdBy: req.user._id
  })

  const blogs = await BlogModel.find()
  return res.render("home", {
    user: req.user,
    blogs: blogs
  })

});

router.post('/comment/:blogId', async(req,res)=>{
 await CommentModel.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy:req.user._id
})
// console.log(comment)
return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports = router  