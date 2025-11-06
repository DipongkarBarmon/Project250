import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "dipongkorbarman02@gmail.com",
    pass: "ewrb fyqw wtky ortk",
  },
});

const sentMail=async () => {
  try{  
    const info = await transporter.sendMail({
      from: '"HealtCare Service" <dipongkorbarman02@gmail.com>',
      to: "dipongkorbarman21@gmail.com",
      subject: "Hello ✔",
      text: "Hello world?", // plain‑text body
      html: "<b>Hello world?</b>", // HTML body
    });
    //console.log(info)
  }catch(err){
    console.log(err);
   }
}

sentMail()