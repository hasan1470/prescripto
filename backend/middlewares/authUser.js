import jwt from "jsonwebtoken";

// user authentication middleware

const authUser = (req, res, next) => {
  try {

    
    const {token} = req.headers
    if (!token) {
      return res.json({ message: "Unauthorized access" });
    }

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Attach user ID to request body
    next()
  
  
  
  } catch (error) {
    console.log(error);
    res.json({ message: error.message , Place: "authUser middleware"});
  }
}

export default authUser