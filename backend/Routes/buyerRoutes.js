import express from 'express';
import {addToCart, getAllBooks, getCartBooks, myOrder, placeOrder } from '../Controllers/buyerControllers.js';
import { verifyUser } from '../Middlewares/Verify.js';

const buyerRouter = express.Router();


buyerRouter.get('/all-books' , verifyUser ,  getAllBooks);
buyerRouter.post('/add-to-cart' , verifyUser , addToCart);
buyerRouter.get('/cart' , verifyUser , getCartBooks);
buyerRouter.post('/place-order' , verifyUser , placeOrder);
buyerRouter.get('/my-order' , verifyUser , myOrder);


export default buyerRouter;
