import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
const bcrypt = require('bcrypt');
const app = express();
const PORT = 5000;
const JWT_SECRET = "quocnhucheck"; // Secret key for JWT

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Dummy user data with roles
const users = [
  { id: 1, username: "admin", password: "$2y$10$wBuO1A8XJXn2vQcgZ2hLqeGFapxyugiqVZXiTJmH.4MO0OSyeKKYy", role: "admin" },
  { id: 2, username: "editor", password: "$2y$10$AB90Itu06WFqcswLLhJJEuA7PE.TQCMtG9vSSDwNPLFpKk5z.ffeG", role: "editor" },
  { id: 3, username: "viewer", password: "$2y$10$AB90Itu06WFqcswLLhJJEuA7PE.TQCMtG9vSSDwNPLFpKk5z.ffeG", role: "viewer" },
  { id: 4, username: "user4", password: "75803", role: "admin" },
  { id: 5, username: "user5", password: "30384", role: "viewer" },
  { id: 6, username: "user6", password: "40678", role: "viewer" },
  { id: 7, username: "user7", password: "59610", role: "admin" },
  { id: 8, username: "user8", password: "93454", role: "admin" },
  { id: 9, username: "user9", password: "66403", role: "admin" },
  { id: 10, username: "user10", password: "56280", role: "admin" },
  { id: 11, username: "user11", password: "99056", role: "admin" },
  { id: 12, username: "user12", password: "17415", role: "admin" },
  { id: 13, username: "user13", password: "97063", role: "admin" },
  { id: 14, username: "user14", password: "21389", role: "admin" },
  { id: 15, username: "user15", password: "65615", role: "admin" },
  { id: 16, username: "user16", password: "41621", role: "editor" },
  { id: 17, username: "user17", password: "75245", role: "viewer" },
  { id: 18, username: "user18", password: "44760", role: "editor" },
  { id: 19, username: "user19", password: "11834", role: "admin" },
  { id: 20, username: "user20", password: "89034", role: "editor" },
  { id: 21, username: "user21", password: "99244", role: "viewer" },
  { id: 22, username: "user22", password: "49557", role: "admin" },
  { id: 23, username: "user23", password: "63898", role: "admin" },
  { id: 24, username: "user24", password: "57911", role: "viewer" },
  { id: 25, username: "user25", password: "62230", role: "admin" },
  { id: 26, username: "user26", password: "43101", role: "editor" },
  { id: 27, username: "user27", password: "29271", role: "editor" },
  { id: 28, username: "user28", password: "70482", role: "editor" },
  { id: 29, username: "user29", password: "92571", role: "viewer" },
  { id: 30, username: "user30", password: "14015", role: "editor" },
  { id: 31, username: "user31", password: "50051", role: "admin" },
  { id: 32, username: "user32", password: "98171", role: "editor" },
  { id: 33, username: "user33", password: "81429", role: "admin" },
  { id: 34, username: "user34", password: "31143", role: "viewer" },
  { id: 35, username: "user35", password: "31553", role: "editor" },
  { id: 36, username: "user36", password: "42282", role: "editor" },
  { id: 37, username: "user37", password: "96609", role: "viewer" },
  { id: 38, username: "user38", password: "39301", role: "viewer" },
  { id: 39, username: "user39", password: "90353", role: "editor" },
  { id: 40, username: "user40", password: "52590", role: "viewer" },
  { id: 41, username: "user41", password: "41312", role: "admin" },
  { id: 42, username: "user42", password: "27085", role: "viewer" },
  { id: 43, username: "user43", password: "50761", role: "viewer" },
];

// Role permissions map
const rolePermissions = {
  admin: ["/dashboard", "/users"],
  viewer: ["/dashboard", "/users"],
};

// Registration route (can be removed if you only need login)
app.post("/register", (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if the username already exists
    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Add new user to the users array
    const newUser = {
      id: users.length + 1, // Simple ID generation for demo
      username,
      password,
      role,
    };
    users.push(newUser);
    console.log("new array", users);
    res.status(201).json({ message: "Registration successful", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Logout
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Cleared cookie!", success: true });
});
// Login route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log("check--<>", req.body);
    const user = users.find(
      (u) => u.username === username
    ); //
    // Hash the password from the frontend (to simulate hashing as per your request)
    const hashedPasswordFromFrontend = await bcrypt.hash(password, 10);  // Hashing frontend password

    // Compare the hashed frontend password with the stored password in the user array
    const isPasswordValid = await bcrypt.compare(hashedPasswordFromFrontend, user.password);

    if (!isPasswordValid  && !user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // if (!user) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }
    

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send the token in a cookie, and also include role-based permissions
    res.cookie("token", token, { httpOnly: true, maxAge: 3600 * 1000 }).json({
      message: "Logged in",
      role: user.role,
      permissions: rolePermissions[user.role], // Attach role-specific permissions
      user: user.username,
      isAuthenticated: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Middleware to verify JWT token and check role-based access
const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ message: "Access Denied" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      req.user = user; //req.afterauthentication = user (decode)

      // Check if the user has access to the requested path based on their role
      if (!rolePermissions[user.role].includes(req.path)) {
        return res
          .status(403)
          .json({ message: "Access Denied: Insufficient permissions" });
      }

      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Protected dashboard route
app.get("/dashboard", authenticateToken, (req, res) => {
  try {
    const { username, role } = req.user;

    // Retrieve permissions based on the user's role
    const permissions = rolePermissions[role] || [];

    res.status(200).json({
      message: `Welcome to the dashboard, ${username}`,
      user: {
        username,
        role,
        permissions,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Verify validation to prevent kicked out
app.get("/verify", (req, res) => {
  const token = req.cookies.token;

  if (!token)
    return res
      .status(401)
      .json({ message: "Unauthorized", isAuthenticated: false });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Token is invalid or expired" });

    const { username, role } = decoded;
    const permissions = rolePermissions[role] || [];

    res.json({
      isAuthenticated: true,
      user: {
        username,
        role,
        permissions,
      },
    });
  });
});

app.get("/users", authenticateToken, (req, res) => {
  try {
    const { username, role } = req.user;
    console.log("backend users", req.user);
    // // Retrieve permissions based on the user's role
    // const permissions = rolePermissions[role] || [];

    res.status(200).json({
      message: `Welcome to user Crud`,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
