//json server with authentication endpoints using Nodejs

//to create the server
const jsonServer = require("json-server");

//to enable cors
const cors = require("cors");

//token generation and verification
const jwt = require("jsonwebtoken");

//create the servers
const server = jsonServer.create();

//router to handle api routes
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const cryptoModule = require("crypto");

// Enable CORS, to allow requests from different origins, from different domains
server.use(cors());

//adds default functionalitites
server.use(middlewares);

//access request data in a convenient format
server.use(jsonServer.bodyParser);

// Generate secret key to sign the tokens, ensuring integrity, the same secret key is used
const secretKey = cryptoModule.randomBytes(32).toString("hex");

//verify token function
const verifyToken = (token) => {
  try {
    //decode and verify token
    const decodedToken = jwt.verify(token, secretKey);
    //return boolean result
    return decodedToken;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
// Registeration endpoint
server.post("/users", (req, res, next) => {
  try {
    const { email } = req.body;
    //check if the email is taken
    const user = router.db.get("users").find({ email }).value();
    //if email belongs to another user return an error
    if (user) {
      res.status(401).json({ message: "Email is already taken" });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
  }
});

// Authentication endpoint
server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Find user by email and password
  const user = router.db.get("users").find({ email, password }).value();

  if (user) {
    //token header
    const header = {
      alg: "HS256",
      typ: "JWT",
    };
    //token payload
    const payload = {
      user: user,
    };

    // Generate token
    const token = jwt.sign(payload, secretKey, { header });

    // Return the token in the response
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: "invalid credentials" });
  }
});

//update user info endpoint
server.patch("/users/:userId", (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (!token) {
      return res.status(401).json({ message: "No token available" });
    }
    const decoded = verifyToken(token);
    if (decoded) {
      const { email } = req.body;
      //check if the email is taken
      const user = router.db.get("users").find({ email }).value();
      if (user) {
        res.status(401).json({ message: "Email is already taken" });
      } else {
        next();
      }
    } else {
      res.status(401).json({ error: "Ivalid token" });
    }
  } catch (error) {
    res.status(401).json({ error: "Failed to change" });
  }
});

server.get("/users/user", (req, res) => {
  //extract token
  const token = req.headers.authorization?.split(" ")[1];

  try {
    //if no token
    if (!token) {
      return res.status(401).json({ message: "No token available" });
    }
    const decoded = verifyToken(token);

    const user = decoded.user;
    const userId = user.id;
    const email = user.email;
    const username = user.username;
    const role = user.role;
    res.status(200).json({
      message: "sucess",
      user: { id: userId, username: username, email: email, role: role },
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

server.use(router);

// Start the server
server.listen(3000, () => {
  console.log("JSON Server is running on port 3000");
});
