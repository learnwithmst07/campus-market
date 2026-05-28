
// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const session = require("express-session");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/auth");
// const listingsRoutes = require("./routes/listings");
// const path = require("path");
// const fs = require("fs");

// const app = express();

// // Validate SESSION_SECRET
// if (!process.env.SESSION_SECRET) {
//   console.error("Error: SESSION_SECRET is not defined in .env file");
//   process.exit(1);
// }

// // Create uploads folder if it doesn't exist
// const uploadsDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
//   console.log("Created uploads directory");
// }

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(express.json({ limit: "50mb" }));
// // Log requests to the uploads folder
// app.use("/uploads", (req, res, next) => {
//   console.log(`Request for: ${req.url}`);
//   next();
// }, express.static(path.join(__dirname, "uploads")));
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
//   })
// );

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/listings", listingsRoutes);

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


//working backend 

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/auth");
// const listingsRoutes = require("./routes/listings");
// const cartRoutes = require("./routes/cart");
// const path = require("path");
// const fs = require("fs");

// const app = express();

// // Validate SESSION_SECRET
// if (!process.env.SESSION_SECRET) {
//   console.error("Error: SESSION_SECRET is not defined in .env file");
//   process.exit(1);
// }

// // Create uploads folder if it doesn't exist
// const uploadsDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
//   console.log("Created uploads directory");
// }

// // Connect to MongoDB
// connectDB();

// // Middleware
// // app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "campus-market-pink.vercel.app"
//   ],
//   credentials: true
// }));
// app.use(express.json({ limit: "50mb" }));
// // Log requests to the uploads folder
// app.use("/uploads", (req, res, next) => {
//   console.log(`Request for: ${req.url}`);
//   next();
// }, express.static(path.join(__dirname, "uploads")));

// // Session setup with MongoDB store
// // app.use(
// //   session({
// //     secret: process.env.SESSION_SECRET,
// //     resave: false,
// //     saveUninitialized: false,
// //     store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/campusmarket" }),
// //     cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
// //   })
// // );
// app.set("trust proxy", 1);
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGO_URI,
//     }),
//     cookie: {
//       secure: true,
//       sameSite: "none",
//       maxAge: 24 * 60 * 60 * 1000,
//     },
//   })
// );

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/listings", listingsRoutes);
// app.use("/api/cart", cartRoutes);

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const listingsRoutes = require("./routes/listings");
const cartRoutes = require("./routes/cart");

const path = require("path");
const fs = require("fs");

const app = express();


// =========================
// Validate ENV
// =========================
if (!process.env.SESSION_SECRET) {
  console.error("❌ SESSION_SECRET missing");
  process.exit(1);
}


// =========================
// Connect MongoDB
// =========================
connectDB();


// =========================
// Trust Proxy (Render)
// =========================
app.set("trust proxy", 1);


// =========================
// CORS
// =========================
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://campus-market-pink.vercel.app",
  ],
  credentials: true,
}));


// =========================
// Preflight Requests
// =========================
app.options("*", cors());


// =========================
// Body Parser
// =========================
app.use(express.json({ limit: "50mb" }));


// =========================
// Uploads Folder
// =========================
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("✅ Uploads folder created");
}

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


// =========================
// Session Middleware
// =========================
app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),

    cookie: {
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);


// =========================
// Test Route
// =========================
app.get("/", (req, res) => {
  res.send("✅ Campus Market API Running");
});


// =========================
// Routes
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/cart", cartRoutes);


// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});