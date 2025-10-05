import jwt from "jsonwebtoken";

export default function (req, res, next) {
  // 1. Get token from the Authorization header
  const authHeader = req.header("Authorization");

  // 2. Check if the token exists and has the 'Bearer' prefix
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // If not, deny access
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // 3. Extract the token from the header ('Bearer <token>')
    const token = authHeader.split(" ")[1];

    // 4. Verify the token using the secret key
    // This will throw an error if the token is invalid or expired
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "zaxscdvfbgnhmj"
    );

    // 5. Attach the user payload from the token to the request object
    req.user = decoded.user;

    // 6. Pass control to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails, deny access
    res.status(401).json({ message: "Token is not valid" });
  }
}
