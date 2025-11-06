import Doctor from "@/lib/mongodb/models/doctor"
 
import { sendVerifictionCode } from "@/Middleware/Email";
 



export async function POST(request) {
  try {
    const body=await request.json();
    const email=body.email;
    const doctor=Doctor.find({email:email})
    if(!doctor){
      return res.status(400).json({success:false,message:"Inavlid email"})
    }
    const varificationCode=Math.floor(100000+Math.random()*900000).toString();
    doctor.varificationCode=varificationCode;
    await doctor.save();
    await sendVerifictionCode(doctor.email,varificationCode);
  } catch (error) {
     return res.status(400).json({success:false,message:"internal server error"})
  }
  
}