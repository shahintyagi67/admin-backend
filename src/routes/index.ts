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
  createBusiness
);
router.get('/business', userAuth, getBusiness);

//services
router.post('/category', upload.single('icon_image'), createCategory);
router.get('/get-category', getCategory);
router.post('/subcategory', createSubcategory);
router.get('/get-subcategory', getSubcategory);

// booking
router.post('/booking', userAuth, createBooking);
router.get('/get-booking', getBooking);
router.patch('/booking/:id/cancel', cancelBooking);
router.patch('/booking/:id/completed', completeBooking)

export default router;
