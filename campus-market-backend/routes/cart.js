const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Listing = require("../models/Listing");

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: "Please log in to perform this action" });
};

// Add item to cart
router.post("/add", isAuthenticated, async (req, res) => {
  const { listingId, quantity } = req.body;
  const userId = req.session.userId;

  try {
    // Validate listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if the item is already in the cart
    let cartItem = await Cart.findOne({ userId, listingId });
    if (cartItem) {
      // Update quantity if item exists
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = new Cart({
        userId,
        listingId,
        quantity: quantity || 1,
      });
      await cartItem.save();
    }

    res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's cart
router.get("/", isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  try {
    const cartItems = await Cart.find({ userId }).populate("listingId");
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove item from cart
router.delete("/remove/:listingId", isAuthenticated, async (req, res) => {
  const { listingId } = req.params;
  const userId = req.session.userId;

  try {
    const cartItem = await Cart.findOneAndDelete({ userId, listingId });
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    res.status(200).json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
// const express = require("express");
// const router = express.Router();
// const Cart = require("../models/Cart");
// const Listing = require("../models/Listing");

// // Middleware to check if user is logged in
// const isAuthenticated = (req, res, next) => {
//   if (req.session.userId) {
//     return next();
//   }
//   res.status(401).json({ message: "Please log in to perform this action" });
// };

// // Get user's cart
// router.get("/", isAuthenticated, async (req, res) => {
//   try {
//     let cart = await Cart.findOne({ userId: req.session.userId }).populate({
//       path: "items.listingId",
//       select: "productName price category condition",
//       populate: {
//         path: "userId",
//         select: "fullName university",
//       },
//     });

//     if (!cart) {
//       // Create a new cart if none exists
//       cart = new Cart({ userId: req.session.userId, items: [] });
//       await cart.save();
//     }

//     res.status(200).json({ items: cart.items });
//   } catch (error) {
//     console.error("Get cart error:", error);
//     res.status(500).json({ message: "Failed to fetch cart items" });
//   }
// });

// // Add an item to the cart
// router.post("/add", isAuthenticated, async (req, res) => {
//   const { listingId, quantity = 1 } = req.body;

//   try {
//     // Verify the listing exists
//     const listing = await Listing.findById(listingId);
//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }

//     let cart = await Cart.findOne({ userId: req.session.userId });
//     if (!cart) {
//       cart = new Cart({ userId: req.session.userId, items: [] });
//     }

//     // Check if the item is already in the cart
//     const itemIndex = cart.items.findIndex(
//       (item) => item.listingId.toString() === listingId
//     );
//     if (itemIndex !== -1) {
//       // Update quantity if item exists
//       cart.items[itemIndex].quantity += quantity;
//     } else {
//       // Add new item
//       cart.items.push({ listingId, quantity });
//     }

//     await cart.save();
//     res.status(200).json({ message: "Item added to cart", cart });
//   } catch (error) {
//     console.error("Add to cart error:", error);
//     res.status(500).json({ message: "Failed to add item to cart" });
//   }
// });

// module.exports = router;