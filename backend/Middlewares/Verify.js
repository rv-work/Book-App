import jwt from 'jsonwebtoken';
import { prisma } from "../lib/prisma.js";

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;


    if (!token) {
      return res.status(401).json({ msg: 'No token. Auth denied' });
    }

    const decoded = jwt.verify(token, 'secretkey');

    req.user = await prisma.user.findUnique({
      where: {
        id : decoded.id,
      },
    });
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


export const verifySeller = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role !== "seller") {
      return res.status(403).json({ msg: "Only sellers can add books" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
