import express from "express";
import {
  customerController,
} from "../controller/customer";
import { userAuth } from "../middleware/auth";
import { createBusiness, getBusiness } from "../controller/business";
import upload from "../middleware/upload";
import { createCategory, getCategory } from "../controller/category";
import { createSubcategory, getSubcategory } from "../controller/subcategory";
import { cancelBooking, completeBooking, createBooking, getBooking } from "../controller/booking";

const router = express.Router();

//authentication
router.use('/customer', customerController)

//business create
router.post("/business",userAuth,upload.fields([
    { name: "documents", maxCount: 5 },
    { name: "businessImage", maxCount: 5 },
    { name: "flayer", maxCount: 1 },
    { name: "plan_image", maxCount: 1 } 
  ]),
  createBusiness as unknown as express.RequestHandler
);
router.get('/business', userAuth, getBusiness as unknown as express.RequestHandler);

//services
router.post('/category', upload.single('icon_image'), createCategory  as unknown as express.RequestHandler);
router.get('/get-category', getCategory as unknown as express.RequestHandler);
router.post('/subcategory', createSubcategory as unknown as express.RequestHandler);
router.get('/get-subcategory', getSubcategory as unknown as express.RequestHandler);

// booking
router.post('/booking', userAuth, createBooking as unknown as express.RequestHandler);
router.get('/get-booking', getBooking as unknown as express.RequestHandler);
router.patch('/booking/:id/cancel', cancelBooking as unknown as express.RequestHandler);
router.patch('/booking/:id/completed', completeBooking as unknown as express.RequestHandler)

export default router;
