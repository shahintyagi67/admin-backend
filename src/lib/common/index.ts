
import { Response } from "express";

export const makeResponse = async (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  payload: any
): Promise<any> =>
  new Promise(resolve => {
    res.status(statusCode).send({
      success,
      message,
      data: payload,
      code: statusCode
    });
    resolve(statusCode);
  });


export const isEmailValid = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  

 