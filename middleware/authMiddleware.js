import jwt from 'jsonwebtoken';
import { prisma } from "../config/db.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check if token exists in the Headers (Authorization: Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        message: "You are not logged in. Please log in to get access." 
      });
    }

    // 2. Verify the token using your JWT_SECRET from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if the user still exists in PostgrelSQL
    const currentUser = await prisma.user.findUnique({ 
      where: { id: decoded.id } 
    });

    if (!currentUser) {
      return res.status(401).json({ 
        message: "The user belonging to this token no longer exists." 
      });
    }

    // 4. Grant access to the protected route and store user data in 'req'
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token or session expired" });
  }
};


export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action"
      });
    }
    next();
  };
};