import express from "express";
// import {
//   customerController,
// } from "../controller/customer";
import {customerController} from '../controller/customer/index.js'; // ✅ Explicit file import
// import { userAuth } from "../middleware/auth/index.js";
import { userAuth } from "../middleware/auth/index.js";
import { createBusiness, getBusiness } from "../controller/business/index.js";
import upload from "../middleware/upload/index.js";
import { createCategory, getCategory } from "../controller/category/index.js";
import { createSubcategory, getSubcategory } from "../controller/subcategory/index.js";
import { cancelBooking, completeBooking, createBooking, getBooking } from "../controller/booking/index.js";

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
