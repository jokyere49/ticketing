import express, {Request, Response}  from "express";
import { body } from 'express-validator';
import jwt from "jsonwebtoken";

import { validateRequest } from "@jokytickets/common";
import { User } from "../models/user";
import { BadRequestError } from "@jokytickets/common";


const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min:4, max:20})
        .withMessage('Password must be between 4 and 20 characters')
    ],
    validateRequest, // middleware . it throws a requestValidationError if the req received is not valid
    async (req: Request, res: Response)=>{

        const { email, password } = req.body;

        const existingUser = await User.findOne({email});

        if (existingUser) {
            throw new BadRequestError('Email in use')
        }

        const user = User.build({ email, password});
        await user.save();

        // Generate JWT

        const UserJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!);// here to access the environment variable
                                 // ! tells typescript don't worry we are fine no need to check 

        // Store it on session object
        req.session = {
            jwt:UserJwt
        }; 

        res.status(201).send(user);
    }
    // new User({email, password})
);

export { router as signupRouter}