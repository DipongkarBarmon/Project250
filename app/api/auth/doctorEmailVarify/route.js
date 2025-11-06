 
import Doctor from "@/lib/mongodb/models/doctor"
 
import { sendWelcomeEmail } from "@/Middleware/Email";
 



export async function POST(request) {
  try {
    const body=await request.json();
    const varifyCode=body.varifyCode;
    const doctor=Doctor.find({varificationCode:varifyCode})
    if(!doctor){
      return res.status(400).json({success:false,message:"Inavlid or Expired Code"})
    }
    doctor.isVarified=true;
    doctor.varificationCode=undefined;
    await doctor.save();
    await sendWelcomeEmail(doctor.email,doctor.name);
    return res.status(200).json({success:true,message:"Email varified Successfully"})
  } catch (error) {
     return res.status(400).json({success:false,message:"internal server error"})
  }
  
}