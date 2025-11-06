import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "healthcareservice420@gmail.com",
    pass: "yyde fxjz cnuh peto",
  },
});

 