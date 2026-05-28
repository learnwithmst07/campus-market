
// const express = require("express");
// const bcrypt = require("bcryptjs");
// const nodemailer = require("nodemailer");
// const User = require("../models/User");
// const router = express.Router();

// // Temporary storage for user data and OTP (in memory)
// const tempUsers = new Map();

// // Configure nodemailer with Mailtrap SMTP
// const transporter = nodemailer.createTransport({
//   host: process.env.MAILTRAP_HOST,
//   port: process.env.MAILTRAP_PORT,
//   auth: {
//     user: process.env.MAILTRAP_USER,
//     pass: process.env.MAILTRAP_PASS,
//   },
// });

// // Generate OTP
// const generateOtp = () => {
//   return Math.floor(1000 + Math.random() * 9000).toString();
// };

// // Middleware to check if user is logged in
// const isAuthenticated = (req, res, next) => {
//   if (req.session.userId) {
//     return next();
//   }
//   res.status(401).json({ message: "Please log in" });
// };

// // Signup Route - Store user data temporarily and send OTP
// router.post("/signup", async (req, res) => {
//   const { fullName, university, email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = generateOtp();
//     const otpExpires = Date.now() + 5 * 60 * 1000;

//     tempUsers.set(email, {
//       userData: { fullName, university, email, password: hashedPassword },
//       otp,
//       otpExpires,
//     });

//     const mailOptions = {
//       from: "no-reply@campusmarket.com",
//       to: email,
//       subject: "Your CampusMarket OTP",
//       text: `Your OTP for CampusMarket registration is ${otp}. It is valid for 5 minutes.`,
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       res.status(200).json({ message: "OTP sent successfully. Check your Mailtrap inbox." });
//     } catch (emailError) {
//       console.error("Email sending error:", emailError);
//       tempUsers.delete(email);
//       res.status(500).json({ message: "Failed to send OTP. Please try again." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Verify OTP and Save User to Database
// router.post("/verify-otp", async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const tempUser = tempUsers.get(email);
//     if (!tempUser) {
//       return res.status(404).json({ message: "User not found or OTP not requested" });
//     }

//     if (tempUser.otp !== otp || tempUser.otpExpires < Date.now()) {
//       tempUsers.delete(email);
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     const user = new User(tempUser.userData);
//     await user.save();

//     tempUsers.delete(email);
//     res.status(200).json({ message: "Signup successful! You can now log in." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Login Route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     req.session.userId = user._id;
//     res.status(200).json({ message: "Login successful" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Logout Route
// router.post("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.status(500).json({ message: "Failed to log out" });
//     }
//     res.status(200).json({ message: "Logout successful" });
//   });
// });

// // Check Session (Protected Route)
// router.get("/check-session", isAuthenticated, (req, res) => {
//   res.status(200).json({ message: "User is logged in", userId: req.session.userId });
// });

// // Check Authentication Status (Non-Protected Route)
// router.get("/check-auth", async (req, res) => {
//   if (req.session.userId) {
//     try {
//       const user = await User.findById(req.session.userId).select("fullName email university");
//       if (!user) {
//         return res.status(404).json({ isAuthenticated: false, message: "User not found" });
//       }
//       res.status(200).json({ isAuthenticated: true, user });
//     } catch (error) {
//       console.error("Check auth error:", error);
//       res.status(500).json({ isAuthenticated: false, message: "Server error" });
//     }
//   } else {
//     res.status(200).json({ isAuthenticated: false });
//   }
// });

// module.exports = router;
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();


// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: "Please log in" });
};

// Signup Route - Save User to Database directly
router.post("/signup", async (req, res) => {
  const { fullName, university, email, password, class: userClass, branch } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      university,
      email,
      password: hashedPassword,
      class: userClass,
      branch,
    });
    await user.save();

    res.status(201).json({ message: "Signup successful! You can now log in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    req.session.userId = user._id;
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

// Check Session (Protected Route)
router.get("/check-session", isAuthenticated, (req, res) => {
  res.status(200).json({ message: "User is logged in", userId: req.session.userId });
});

// Check Authentication Status (Non-Protected Route)
router.get("/check-auth", async (req, res) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select("fullName email university class branch");
      if (!user) {
        return res.status(404).json({ isAuthenticated: false, message: "User not found" });
      }
      res.status(200).json({ isAuthenticated: true, user });
    } catch (error) {
      console.error("Check auth error:", error);
      res.status(500).json({ isAuthenticated: false, message: "Server error" });
    }
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
});

// Update Profile (Authenticated Users Only)
router.put("/update-profile", isAuthenticated, async (req, res) => {
  const { fullName, email, university, class: userClass, branch } = req.body;

  try {
    // Find the user by session userId
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the new email is already taken by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use by another account" });
      }
    }

    // Update user fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.university = university || user.university;
    user.class = userClass !== undefined ? userClass : user.class;
    user.branch = branch !== undefined ? branch : user.branch;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;