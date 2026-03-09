
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

export const login = async (req, res) => {
try{
const {email, password} = req.body;

const user = await prisma.user.findUnique({
    where: {email}});

    if (!user){
    return res.status(401).json ({message: "Invalid email or password"});
    }

    const isPaswordCorrect = await bycrypt.compare(password, user.password);
    if(!isPaswordCorrect){
        return res.status(401).json({message: "Invalid email or password"});
    }

   const token = jwt.sign(
  { id: user.id, role: user.role }, 
  process.env.JWT_SECRET, // Ensure this matches your .env exactly
  { expiresIn: '1d' }
);

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user: {id: user.id, email: user.emai, role: user.role}
        }
    })


}catch(error){
res.status(500).json({message: error.message})};
 

};