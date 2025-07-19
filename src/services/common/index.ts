import bcrypt from "bcrypt";
import { isEmailValid } from "../../lib/common/index.js";
import { IUser } from "../../lib/interface/customer/index.js";
import User from "../../model/customer/index.js";
import jwt from "jsonwebtoken";


export const handleUserSignup = async (payload: any): Promise<IUser> => {
  const {
    username,
    user_type,
    email,
    password,
    business_phone,
    whatsapp_phone,
    country,
    referalSource,
    agent,
    agent_code,
  } = payload;

  if (!email || !password) {
    throw { code: 400, message: "Email and password are required" };
  }

  if (!isEmailValid(email)) {
    throw { code: 400, message: "Invalid email" };
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw { code: 409, message: "Email already exists", data: userExists };
  }

  const otp = Math.floor(1000 + Math.random() * 9000);
  const otpExpires = new Date(Date.now() + 1 * 60 * 1000);
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    user_type,
    email,
    password: hashedPassword,
    business_phone,
    whatsapp_phone,
    country,
    referalSource,
    agent,
    agent_code,
    otp,
    otpExpires,
  });

  await newUser.save();

  return newUser;
};

export const handleUserLogin = async (payload : any) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw { code: 400, message: "Email and password are required" };
  }

  const user = await User.findOne({ email }) as IUser | null;
  if (!user) {
    throw { code: 400, message: "Invalid credentials." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw { code: 400, message: "Invalid credentials." };
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
  return { user, token };
};


export const handleOtpVerification = async (payload: any) => {
  const {email , otp} = payload;
  const user = await User.findOne({ email }) as IUser | null;

  if (!user) {
    throw { code: 404, message: "User not found" };
  }

  if (user.otp !== parseInt(otp.toString())) {
    throw { code: 400, message: "Invalid otp" };
  }

  if (!user.otpExpires || new Date(user.otpExpires) < new Date()) {
    throw { code: 400, message: "OTP has expired" };
  }

  if (user.isVerified) {
    user.resetPassword = true;
  } else {
    user.isVerified = true;
  }

  user.otp = null as any;
  user.otpExpires = null as any;

  await user.save();

  return { success: true };
};


export const handleResendOtp = async(payload: any) => {
  const {email} = payload;
  if(!email){
    throw {code: 400, message:'Email field is required'}
  }
  const user = await User.findOne({email}) as IUser | null;
  if(!user){
    throw {code: 404, message: 'User not found'}
  }      
  
  if(user.isVerified){
    throw {code: 400, message:'User is already verified'}
  }
  const newOtp = Math.floor(1000 + Math.random() * 9000);
  const newOtpExpires = new Date(Date.now()+ 10 * 60 * 1000);

  user.otp = newOtp as any;
  user.otpExpires = newOtpExpires as any;

  await  user.save();
  return user
}

export const handleForgotPassword = async (payload: any) => {
  const { email } = payload;

if(!email){
  throw {code:400, message:'Email field is required'}
}

  const user = await User.findOne({ email }) as IUser | null;

  if (!user) {
    throw { code: 404, message: "User not found" };
  }

  const otp = Math.floor(1000 + Math.random() * 9000);
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

  user.otp = otp as any;
  user.otpExpires = otpExpires as any;
  user.resetPassword = false;

  await user.save();

  console.log(`OTP for ${email}: ${otp}`);
  return true;
};

export const handleResetPassword = async (payload: any) => {
  const { email, newPassword } = payload;

  if (!email || !newPassword) {
    throw { code: 400, message: "Email and new password are required" };
  }

  const user = await User.findOne({ email }) as IUser | null;

  if (!user) {
    throw { code: 404, message: "User not found" };
  }

  if (!user.resetPassword) {
    throw { code: 403, message: "OTP not verified for password reset" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetPassword = false;

  await user.save();

  return true;
};

