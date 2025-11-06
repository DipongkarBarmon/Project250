import {transporter} from "./Emailconfig.js"
import {Verification_Email_Template,Welcome_Email_Template} from './EmailTemplate.js'

export const sendVerifictionCode=async(email,verificationCode)=>{
    try { 
      const response = await transporter.sendMail({
            from: '"HealtCare Service" <dipongkorbarman02@gmail.com>',
            to:email,
            subject: "Varify your Email",
            text: "Varify your Email", // plain‑text body
            html:Verification_Email_Template.replace("{verificationCode}",verificationCode) // HTML body
          });
          //console.log("Email send successfully!",response);
    } catch (error) {
      console.log(error);
    }
}

export const sendWelcomeEmail= async(email,name)=>{
      try {
        const response=await transporter.sendMail({
            from: '"HealtCare Service" <dipongkorbarman02@gmail.com>',
            to:email,
            subject:"Welcome Email",
            text:"Welcome Email",
            html: Welcome_Email_Template.replace('{name}',name)
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
}