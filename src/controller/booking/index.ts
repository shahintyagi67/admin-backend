import { Request, Response } from "express";
import Booking from "../../model/booking";
import Business from "../../model/business";

export const createBooking = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    console.log("userId",userId);
    if (!userId) {
        return res.status(404).json({ status: false, message: 'Customer not found' })
    }
    const { booking_location, businessId, booking_datetime, planId, total_amount, tax,final_amount, customer_req, quantity } = req.body;
    try {
        const business = await Business.findById(businessId);
        console.log("BusinessId", businessId)
        if (!business) {
            return res.status(404).json({ status: false, message: 'Business Not found' })
        }

        // const selectedPlan = business.plan.find( p => p.plan._id === planId);
        const selectedPlan = business.plan.find(p => p._id?.toString() === planId);
        console.log("PlanId",planId)
        if(!selectedPlan){
            return res.status(404).json({
                status: false,
                message:'Plan not found in business'
            })
        }

        const booking = await Booking.create({
            userId,
            booking_location,
            booking_datetime,
            amount:{
                total_amount,
                tax,
                final_amount,
            },
            customer_req,
            quantity,
            planId,
            businessId: business._id
        });
        return res.status(200).json({
            status: true,
            data: booking
        })
    }catch (err) {
        console.error("booking error:", err);
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
        });
    }
}


