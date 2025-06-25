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

export const getBooking = async(req:Request, res:Response) => {
    try{
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const query: any = {};
  
  const total = await Booking.countDocuments(query);
  const booking = await Booking.find(query).skip((page-1)*limit).limit(limit).sort({createdAt:-1});
  return res.status(200).json({
    status: true,
    data: booking,
    total,
    page,
    limit,
    totalpages: Math.ceil(total/limit)
  })
    }
    catch(err:any){
         return res.status(500).json({
            status: false,
            message: "Something went wrong",
        });
    }
}

export const cancelBooking = async(req: Request, res: Response) => {
 try{
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    const {reason} = req.body;

    if(!booking){
        return res.status(404).json({
            status: false,
            message: "Booking not found",
        });  
    }
    if(booking?.status === 'CANCELLED' || booking?.status === 'COMPLETED'){
        return res.status(400).json({
            status: false,
            message: "Booking is already cancelled",
        })
    }
    booking.status = "CANCELLED";
    booking.cancellationReason = reason ||'No reason',
    await booking.save();
     res.status(200).json({
      status: true,
      message: "Booking cancelled successfully",
      data: booking
    });
 }catch(err: any){
    return res.status(500).json({
            status: false,
            message: "Something went wrong",
        });
 }
}

