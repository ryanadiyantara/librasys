import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  // Get the authorization from the request header
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Check if the authorization header is present
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Get the token from the authorization header
  const token = authHeader.split(" ")[1];

  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    // Store the user ID in the request object
    // Not yet used in this project
    req.pid = decoded.UserInfo.pid;
    next();
  });
};

export default verifyJWT;
