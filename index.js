const express = require("express")
const path = require("path")
const RequestMiddleware = require("./middleware/Request")
const mongoose = require("mongoose")
const userRoute = require("./routes/userRoutes")
const blogRoute = require("./routes/blogRoutes")
const cookieParser = require("cookie-parser")
const {AuthenticateMiddleware, restrictuserRole} = require("./middleware/authenticate")
const BlogModel = require("./model/blog")

const app = express()
const PORT = 3000


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(RequestMiddleware("Request.txt"));
app.use(cookieParser())
app.use(AuthenticateMiddleware("Token"))
app.use(express.static(path.resolve("./public")))

// Connect Database
mongoose.connect("mongodb://localhost:27017/blogify")
.then(() => console.log("Mongodb is connected!"))
.catch((err) => console.log("Error: ", err)) 


// Template Engine
app.set("view engine", "ejs")
app.set('views', path.resolve("./views"))  

// Routes
app.get('/', async (req, res) => {
    const blogs = await BlogModel.find()
    res.render('home', { 
        blogs: blogs ,
        user:req.user
    });
});

app.use('/user', userRoute)
app.use('/blog',restrictuserRole(["USER"]), blogRoute) 

// Server running
app.listen(PORT, async () => {
    console.log(`Server is runing on localhost:${PORT}`)
})