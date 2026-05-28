const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   items: [
//     {
//       listingId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Listing",
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         default: 1,
//         min: 1,
//       },
//     },
//   ],
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Update the updatedAt field on save
// cartSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model("Cart", cartSchema);