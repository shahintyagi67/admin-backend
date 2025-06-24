import { Request, Response } from "express";
import Subcategory from "../../model/subcategory";
import Category from "../../model/category"; 
import { stat } from "fs";

export const createSubcategory = async (req: Request, res: Response) => {
    const { name, category } = req.body;

    if (!name || !category) {
        return res.status(400).json({
            status: false,
            message: "Name and category ID are required",
        });
    }

    try {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({
                status: false,
                message: "Category not found",
            });
        }

        const subcategory = await Subcategory.create({ name, category });

        return res.status(201).json({
            status: true,
            message: "Subcategory created successfully",
            data: subcategory,
        });

    } catch (err) {
        console.error("Create subcategory error:", err);
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
        });
    }
};


export const getSubcategory = async(req: Request, res: Response) => {
    try{
        const page = parseInt(req.query.page  as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || '';
 
            const query : any = {};
            if(search){
                query.$or  = [
                    { name : { $regex: search, $options:'i'}}
                ]
            }

        const total = await Subcategory.countDocuments(query);
        const subcategory = await Subcategory.find(query).skip((page-1) * limit).limit(limit).sort({created: -1})
         return res.status(200).json({
            status: true,
            message:"Fetched subcategory Successfully",
            data: subcategory,
            total,
            page,
            limit,
            totalPages: Math.ceil(total/limit)
         })

    }catch (err) {
        console.error("Fetched subcategory error:", err);
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
        });
    }
}