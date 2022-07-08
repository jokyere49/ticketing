import express from 'express';
import { currentUser } from '@jokytickets/common';


const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
    //!req.session || !req.session.jwt ---> !req.session?.jwt
    // currentUser middleware gets the cookie and process if present
    // and add it to req.currentUser object
    // when a get  is made to current user it sends 
    // a response {current: req.currentuser or null}
        res.send({currentUser: req.currentUser || null })
});

// exporting the router and renaming it 
export  { router as currentUserRouter };