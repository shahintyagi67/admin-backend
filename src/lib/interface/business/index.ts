import { Document, Types } from "mongoose";

export interface IBusiness extends Document {
    userId: Types.ObjectId;
    provider_type: 'INDIVIDUAl' | 'BUSINESS';
    business_name: string;
    description: string;
    offer_type: "HOME VISIT" | "LOCATION" | "HYBRID";
    business_documents: {
      documents: string[];
      document_id: string;
    }
    location: {
  type: 'Point';
  coordinates: [number, number]; 
};
plan: {
  plan_name: string;
  plan_price: string;
  plan_description: string;
  plan_image: string;
  isNegotiable?: boolean;
}[];

service: {
  category: Types.ObjectId;
  subcategory: Types.ObjectId[];
};
  locationDetails?: {
        place_number?: string;
        floor?: string;
        street?: string;
        landmark?: string;
    };
      businessImage?: string[];
    flayer?: string;
     status?: "PENDING" | "APPROVED" | "REJECTED";
    name: string,
    icon: string,
    timing:[]
  }