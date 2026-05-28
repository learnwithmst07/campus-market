
// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const Listing = require("../models/Listing");
// const router = express.Router();

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Store images in the 'uploads' directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });
// const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// // Middleware to check if user is logged in
// const isAuthenticated = (req, res, next) => {
//   if (req.session.userId) {
//     return next();
//   }
//   res.status(401).json({ message: "Please log in to perform this action" });
// };

// // Create a new listing (authenticated users only)
// router.post("/", isAuthenticated, upload.single("image"), async (req, res) => {
//   const { productName, description, price, category, condition, mobileNumber } = req.body;
//   console.log("Uploaded File:", req.file); // Debug log
//   const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

//   try {
//     const listing = new Listing({
//       userId: req.session.userId,
//       productName,
//       description,
//       price,
//       category,
//       condition,
//       mobileNumber,
//       image: imagePath,
//     });
//     await listing.save();
//     res.status(201).json({ message: "Listing created successfully", listing });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to create listing" });
//   }
// });

// // Get listings by the current user (authenticated users only)
// router.get("/my-listings", isAuthenticated, async (req, res) => {
//   try {
//     const listings = await Listing.find({ userId: req.session.userId }).populate("userId", "fullName university");
//     res.status(200).json(listings);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch listings" });
//   }
// });

// // Get the latest three listings (public route)
// router.get("/latest", async (req, res) => {
//   try {
//     const listings = await Listing.find()
//       .sort({ createdAt: -1 }) // Sort by createdAt in descending order (newest first)
//       .limit(3) // Limit to 3 results
//       .populate("userId", "fullName university"); // Populate the userId field with fullName and university
//     console.log("Fetched Listings for /latest:", listings); // Debug log
//     res.status(200).json(listings);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch latest listings" });
//   }
// });

// // Get a single listing by ID (public route)
// router.get("/:id", async (req, res) => {
//   try {
//     const listing = await Listing.findById(req.params.id).populate("userId", "fullName university");
//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }
//     res.status(200).json(listing);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch listing" });
//   }
// });

// // Delete a listing (only the creator can delete)
// router.delete("/:id", isAuthenticated, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const listing = await Listing.findById(id);
//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }

//     if (listing.userId.toString() !== req.session.userId) {
//       return res.status(403).json({ message: "You can only delete your own listings" });
//     }

//     await Listing.findByIdAndDelete(id);
//     res.status(200).json({ message: "Listing deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to delete listing" });
//   }
// });

// module.exports = router;
const express = require("express");
const multer = require("multer");
const path = require("path");
const Listing = require("../models/Listing");
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: "Please log in to perform this action" });
};

// Create a new listing (authenticated users only)
router.post("/", isAuthenticated, upload.single("image"), async (req, res) => {
  const { productName, description, price, category, condition, mobileNumber } = req.body;
  console.log("Uploaded File:", req.file); // Debug log
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const listing = new Listing({
      userId: req.session.userId,
      productName,
      description,
      price,
      category,
      condition,
      mobileNumber,
      image: imagePath,
    });
    await listing.save();
    res.status(201).json({ message: "Listing created successfully", listing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create listing" });
  }
});

// Get all listings (public route)
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().populate("userId", "fullName university class branch");
    res.status(200).json(listings);
  } catch (error) {
    console.error("Get listings error:", error);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
});

// Get listings by the current user (authenticated users only)
router.get("/my-listings", isAuthenticated, async (req, res) => {
  try {
    const listings = await Listing.find({ userId: req.session.userId }).populate("userId", "fullName university class branch");
    res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
});

// Get the latest three listings (public route)
router.get("/latest", async (req, res) => {
  try {
    const listings = await Listing.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order (newest first)
      .limit(3) // Limit to 3 results
      .populate("userId", "fullName university class branch"); // Populate the userId field with fullName, university, class, and branch
    console.log("Fetched Listings for /latest:", listings); // Debug log
    res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch latest listings" });
  }
});

// Get a single listing by ID (public route)
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("userId", "fullName university class branch");
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(200).json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch listing" });
  }
});

// Delete a listing (only the creator can delete)
router.delete("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.userId.toString() !== req.session.userId) {
      return res.status(403).json({ message: "You can only delete your own listings" });
    }

    await Listing.findByIdAndDelete(id);
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete listing" });
  }
});

// Mark a listing as sold (only the creator can mark)
router.patch("/:id/sold", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (listing.userId.toString() !== req.session.userId) {
      return res.status(403).json({ message: "You can only update your own listings" });
    }
    listing.isSold = !listing.isSold; // toggle sold status
    await listing.save();
    res.status(200).json({ message: `Listing marked as ${listing.isSold ? "sold" : "available"}`, listing });
  } catch (error) {
    console.error("Mark sold error:", error);
    res.status(500).json({ message: "Failed to update listing status" });
  }
});

module.exports = router;