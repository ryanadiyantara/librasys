import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";
import Member from "../models/member.model.js";

// Controller to handle member login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body; // member will send this data

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  // Check if member exists and if member is deactivated
  const foundMember = await Member.findOne({ email }).exec();

  if (!foundMember || foundMember.na === true) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Check if password is correct
  const match = await bcrypt.compare(password, foundMember.password);

  if (!match) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Generate access token
  const accessToken = jwt.sign(
    {
      // Member info to be stored in token
      MemberInfo: {
        pid: foundMember._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign({ email: foundMember.email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    accessToken: accessToken,
    role: foundMember.role,
  });
});

// To be updated
export const refresh = async (req, res) => {
  // To be updated
  const cookies = req.cookies;
  console.log(req.cookies);
  if (!cookies?.jwt) return res.status(401).json({ success: false, message: "Unauthorized" });
  const refreshToken = cookies.jwt;

  // To be updated
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err.message);
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      const foundMember = await Member.findOne({ email: decoded.email }).exec();

      if (!foundMember) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          MemberInfo: {
            email: foundMember.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ accessToken });
    })
  );
};

// Controller to handle member logout
export const logout = async (req, res) => {
  // To be updated
  // const cookies = req.cookies;
  // console.log(req.cookies);
  // if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: false });
  res.json({
    success: true,
    message: "Cookie cleared",
  });
};

// Controller to handle member forgot password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body; // member will send this data

  // Validate required fields
  if (!email) {
    return res.status(400).json({ success: false, message: "Please provide email" });
  }

  // Check if email member exists
  const foundMember = await Member.findOne({ email }).exec();

  if (!foundMember) {
    return res.status(400).json({ success: false, message: "Email not found" });
  }

  // Generate password reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Set password reset fields in database
  foundMember.passwordResetToken = hashedToken;
  foundMember.passwordResetExpires = Date.now() + 3600000; // 1 hour

  // Save reset token and expiry in database
  await foundMember.save();

  // Create reset URL
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/resetpassword?token=${resetToken}`;

  // Configure email settings
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      member: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: "adiyantararyan@gmail.com",
    to: email,
    subject: "Password Reset Request",
    html: `<p>Hello,</p>
    <p>We received a request to reset your password. Please click the link below to reset your password:</p>
    <a href="${resetURL}">Reset Password</a>
    <p>If you click the reset link, your password will be reset to: librasys123</p>
    <p>If you did not request a password reset, please ignore this email and do not click the reset password link.</p>
    <p>Thank you,</p>
    <p>librasys</p>`,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Reset link sent to email successfully",
    });
  } catch (error) {
    // Rollback
    foundMember.passwordResetToken = undefined;
    foundMember.passwordResetExpires = undefined;

    // Save rollback
    await foundMember.save();

    return res.status(500).json({
      success: false,
      message: "There was an error sending the email. Try again later.",
    });
  }
});

// Controller to handle member reset password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.query; // member will send this data

  // Validate the token
  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }

  // Hash the token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find the member by the hashed token and check if the token is not expired
  const member = await Member.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).exec();

  // Check if member exists and token is valid
  if (!member) {
    res.redirect("/login?message=Token is invalid");
    return;
  }

  // Hash the new password
  const hashedPwd = await bcrypt.hash("librasys123", 10);

  // Update the member's password and clear the reset token and expiration
  member.password = hashedPwd;
  member.passwordResetToken = undefined;
  member.passwordResetExpires = undefined;

  // Save the updated member
  await member.save();

  // Redirect to login page
  res.redirect("/login?message=Password reset successfully");
});
