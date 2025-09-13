import express from 'express';
import { uploadImage } from '../Middlewares/Multer.js';
import { verifySeller, verifyUser } from '../Middlewares/Verify.js';
import { addBook, allOrders, getMyBooks, updateOrderStatus } from '../Controllers/sellerControllers.js';

const sellerRouter = express.Router();


sellerRouter.get('/all-books' , verifyUser , verifySeller , getMyBooks);
sellerRouter.post('/add-book', verifyUser ,  uploadImage.single("coverImage") , addBook);
sellerRouter.get('/orders', verifyUser , verifySeller , allOrders);
sellerRouter.put('/orders/:orderId/status', verifyUser, verifySeller, updateOrderStatus);


export default sellerRouter;
