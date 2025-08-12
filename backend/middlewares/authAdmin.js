import jwt from "jsonwebtoken";

// admin authentication middleware

const authAdmin = (req, res, next) => {
  try {

    
    const {atoken} = req.headers
    if (!atoken) {
      return res.json({ message: "Unauthorized access" });
    }

    // verify the token
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);
    if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({ message: "Invalid token" });
    }
    next(); // proceed to the next middleware or route handler
  
  
  
  } catch (error) {
    console.log(error);
    res.json({ message: error.message , Place: "authAdmin middleware"});
  }
}

export default authAdmin