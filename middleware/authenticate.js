const { validateToken } = require("../util/auth")

function AuthenticateMiddleware(cookieName){
  return async(req,res,next)=>{
    // console.log(req.cookies)
    const TokencookieValue = req.cookies[cookieName]
    if(!TokencookieValue) {
      // return res.status(401).json({ error: 'Authentication token not found' });
      return next()
    }
    // console.log("TokencookieValue",TokencookieValue)
    try{
        const payload = await validateToken(TokencookieValue)
        // console.log("payload: ",payload)
        req.user = payload
        return next()
    } 
    catch(error){
      console.error("Token validation error:", err);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
}

function restrictuserRole(roles = []) {
  return function (req, res, next) {
      if (!req.user) {
          return res.redirect("/user/signup");
      }
      
      // Check if the user's role is included in the allowed roles
      if (!req.user.role || !roles.includes(req.user.role)) {
          return res.status(403).end("Unauthorized");
      }
      
      return next();
  };
}

module.exports = {AuthenticateMiddleware, restrictuserRole}