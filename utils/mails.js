import nodemailer from "nodemailer";

export const generateOtp = () => {
  var otp = Math.floor(1000 + Math.random() * 9000);
  return {
    otp,
    expireTime: new Date().getTime() + 300 * 1000,
  };
};

export function mailTransport() {
  var transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    port: 465,
    host: "smtp.gmail.com",
    secure: true,
  });

  return transport;
}

export const resetpasswordTemplet = (link) =>
  ` <!DOCTYPE html>
 <html>
 <head>
   <meta charset="UTF-8">
   <title>Password Reset</title> 
 </head>
 <body>
   <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">
     <tr>
       <td align="center" bgcolor="#f8f8f8" style="padding: 40px 0;">
         <h1>Password Reset</h1>
       </td>
     </tr>
     <tr>
       <td bgcolor="#ffffff" style="padding: 40px 30px;">
        <p>Hello,</p>
         <p>You have requested to create your password. Please click on the link below to reset your password:</p>
         <p><a href="${link}">Reset Password</a></p>
         <p>If you did not request a password reset, please ignore this email.</p>
         <p>Best regards,</p>
         <p>Your Platform Team</p>
       </td>
     </tr>
     <tr>
       <td bgcolor="#f8f8f8" align="center" style="padding: 20px 0;">
         <p style="margin: 0; font-size: 12px;">&copy; 2023 Your Platform. All rights reserved.</p>
       </td>
     </tr>
   </table>
 </body>
 </html>
`;

export const generateEmailTemplet = (code) => `
 <!DOCTYPE html>
 <html>
 <head>
   <meta charset="UTF-8">
   <title>Email Verification</title>
 </head>
 <body>
   <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">
     <tr>
       <td align="center" bgcolor="#f8f8f8" style="padding: 40px 0;">
         <h1>Email Verification</h1>
       </td>
     </tr>
     <tr>
       <td bgcolor="#ffffff" style="padding: 40px 30px;">
         <p>Hello,</p>
         <p>Thank you for registering with our platform. To complete your registration, please use the following OTP (One-Time Password):</p>
         <p style="font-size: 24px; font-weight: bold;">${code}</p>
         <p>Please enter this OTP in the verification form to activate your account.</p>
         <p>If you did not request this verification, please ignore this email.</p>
         <p>Best regards,</p>
         <p>Your Platform Team</p>
       </td>
     </tr>
     <tr>
       <td bgcolor="#f8f8f8" align="center" style="padding: 20px 0;">
         <p style="margin: 0; font-size: 12px;">&copy; 2023 Your Platform. All rights reserved.</p>
       </td>
     </tr>
   </table>
 </body>
 </html>
`;

export const plainEmailTemplate = (heading, message) => `
 <!DOCTYPE html>
 <html>
 <head>
   <meta charset="UTF-8">
   <title>Welcome to Our Site</title>
 </head>
 <body>
   <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">
     <tr>
       <td align="center" bgcolor="#f8f8f8" style="padding: 40px 0;">
         <h1>${heading}</h1>
       </td>
     </tr>
     <tr>
       <td bgcolor="#ffffff" style="padding: 40px 30px;">
         <p>Hello,</p>
         <p>${message}</p>
         <p>Thank you for joining our platform. We are excited to have you on board!</p>
         <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
         <p>Best regards,</p>
         <p>Your Platform Team</p>
       </td>
     </tr>
     <tr>
       <td bgcolor="#f8f8f8" align="center" style="padding: 20px 0;">
         <p style="margin: 0; font-size: 12px;">&copy; 2023 Your Platform. All rights reserved.</p>
       </td>
     </tr>
   </table>
 </body>
 </html>
`;
