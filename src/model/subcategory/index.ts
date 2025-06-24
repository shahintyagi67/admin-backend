import mongoose, { Types } from "mongoose";


const subcategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    category:{
        type: Types.ObjectId,
        ref:'Category'
    }
})
const Subcategory = mongoose.model('Subcategory', subcategorySchema);
export default Subcategory;