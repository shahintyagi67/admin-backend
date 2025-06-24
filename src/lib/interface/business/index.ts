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
    location: string,
    name: string,
    icon: string,
    timing:[]
  }