const { Router } = require("express");
const router = Router();
const UserModel = require("../model/user");
const BlogModel = require("../model/blog");

router.get('/signin', async (req, res) => {
  return res.render("signin");
});

router.post('/signin', async (req, res) => {
  const { email,password } = req.body
  try{
    const token = await UserModel.matchPasswordandCreateToken(email,password)
    return res.cookie("Token", token).redirect("/");
  }
  catch(err){
   return res.render("signin", {
    error:"Incorrect Email or Password"
   })
  }
});

router.get('/signup', async (req, res) => {
 return res.render("signup")
});

router.post('/signup', async (req, res) => {
  const { Fullname, email, password } = req.body;

  if (!Fullname || !email || !password) {
    return res.status(400).json({ error: 'Full name, email, and password are required' });
  }

  try {
    await UserModel.create({
      Fullname,
      email,
      password
    });
    const blogs = await BlogModel.find()
    return res.render("signin",{
      user:req.user,
      blogs:blogs
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error creating user' });
  }
});

router.get('/logout', async(req,res)=>{
  return res.clearCookie('Token').redirect('/')
})

module.exports = router;
