import Category from "../../model/category/index.js";
import { Request, Response } from "express";

export const createCategory = async(req: Request, res: Response) => {
    const { name} = req.body;
    try{
        //  const file = req.file;
        // //  const icon_image = file ? file.path : "";
        //  const  icon_image = file ? `/upload/icon/${file.filename}` : '';
        const file = req.file;
        const icon_image = file ? file.path : ''; // Cloudinary gives `path` as URL
    
        const category = await Category.create({
            name,
            icon_image
            
        })
         return res.status(200).json({
            status: true,
            message: 'Category created successfully',
            data: category
         })

    }catch(err: any){
        console.error("Create business error:", err);
        return res.status(500).json({
            status: false,
            message:`Something went wrong`, 
        })
    }
}

export const getCategory = async(req: Request, res: Response) => {
    try{
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || '' ;
  
       const query: any = {};
       if(search){
        query.$or = [
            {name: {$regex: search, $options:'i' }}
        ]
       }

       const total = await Category.countDocuments(query);
        const category = await Category.find(query).skip((page-1)*limit).limit(limit).sort({created:-1})
         return res.status(200).json({
            status: true,
            message:"Fetched category Successfully",
            data: category,
            total,
            page,
            limit,
            totalPages: Math.ceil(total/limit)
         })

    }catch (err) {
        console.error("fetch category error:", err);
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
        });
    }
}
