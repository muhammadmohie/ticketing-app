import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import  jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from '@mm-ticketing-app/common';
import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signup', [
    // validation array
    body('email')
        .isEmail()
        .withMessage('Provide a valid email'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20})  
        .withMessage('Password must be between 4 and 20 characters')
], validateRequest,
   async (req: Request, res: Response) => {
    
    const { email, password } = req.body;

    // Check user existence inside the collection
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new BadRequestError('This email already in use.');
    }

    // Creating user

    const user = User.build({ email, password});
    
    // Save user

    await user.save();

    // generate JWT

    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, 
        process.env.JWT_KEY!
        // loaded from env variable created inside kub secret
    );

    // store JWT in cookie session

    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user);

});

export { router as signupRouter };