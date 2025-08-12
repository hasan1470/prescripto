import jwt from "jsonwebtoken";

// doctor authentication middleware

const authDoctor = (req, res, next) => {
  try {

    
    const {dtoken} = req.headers
    if (!dtoken) {
      return res.json({ message: "Unauthorized access" });
    }

    // verify the token
    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);

    req.docId = decoded.id; // Attach user ID to request body

    next(); // proceed to the next middleware or route handler
  
  
  
  } catch (error) {
    console.log(error);
    res.json({ message: error.message , Place: "authAdmin middleware"});
  }
}

export default authDoctor