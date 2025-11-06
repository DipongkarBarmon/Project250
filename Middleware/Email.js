import {transporter} from "./Emailconfig.js"

export const sendVerifictionCode=async(email,verificationCode)=>{
    try {
      const response = await transporter.sendMail({
            from: '"HealtCare Service" <dipongkorbarman02@gmail.com>',
            to:email,
            subject: "Varify your Email",
            text: "Varify your Email", // plain‑text body
            html:verificationCode // HTML body
          });
          console.log("Email send successfully!",response);
    } catch (error) {
      console.log(error);
    }
}