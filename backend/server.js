const Express = require("express");
const Cors = require("cors");
const Db = require("./mysql_db");
const Bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken");
const SecretKey = "your_jwt_secret_key";

const App = Express();

// Middleware
App.use(Cors());
App.use(Express.json());

// POST http://localhost:3000/auth/register
App.post("/auth/register", (req, res) => {
  const { full_name, email, password, role_name } = req.body;

  // Validation
  if (!full_name || !email || !password || !role_name) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  // Find the role_id based on the role_name provided
  Db.query(
    "SELECT role_id FROM roles WHERE role_name = ?",
    [role_name],
    (RoleErr, RoleResults) => {
      if (RoleErr) return res.status(500).json(RoleErr);

      if (RoleResults.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Role '${role_name}' does not exist.`,
        });
      }

      const RoleID = RoleResults[0].role_id;

      // Hash the password
      Bcrypt.hash(password, 10, (HashErr, HashedPassword) => {
        if (HashErr) return res.status(500).json(HashErr);

        // Insert the user using the ID from the roles table
        Db.query(
          "INSERT INTO users (full_name, email, password, role_id) VALUES (?, ?, ?, ?)",
          [full_name, email, HashedPassword, RoleID],
          (InsertErr, Result) => {
            if (InsertErr) {
              if (InsertErr.code === "ER_DUP_ENTRY") {
                return res
                  .status(400)
                  .json({ success: false, message: "Email already exists" });
              }
              return res.status(500).json(InsertErr);
            }

            res.status(201).json({
              success: true,
              message: `User created successfully as ${role_name}!`,
              id: Result.insertId,
            });
          },
        );
      });
    },
  );
});

// POST http://localhost:3000/auth/login
App.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const sql = `
    SELECT u.*, r.role_name 
    FROM users u 
    INNER JOIN roles r ON u.role_id = r.role_id 
    WHERE u.email = ?`;

  Db.query(sql, [email], (Err, Results) => {
    if (Err) return res.status(500).json(Err);
    if (Results.length === 0)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const User = Results[0];
    Bcrypt.compare(password, User.password, (CompareErr, IsMatch) => {
      if (CompareErr) return res.status(500).json(CompareErr);
      if (!IsMatch)
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });

      const Token = Jwt.sign(
        { id: User.user_id, role: User.role_name },
        SecretKey,
        { expiresIn: "1h" },
      );
      res.json({ success: true, token: Token });
    });
  });
});

// GET http://localhost:3000/auth/profile
App.get("/auth/profile", (req, res) => {
  const AuthHeader = req.headers["authorization"];
  const Token = AuthHeader && AuthHeader.split(" ")[1];

  if (!Token)
    return res
      .status(401)
      .json({ success: false, message: "No Token Provided" });

  Jwt.verify(Token, SecretKey, (VerifyErr, UserData) => {
    if (VerifyErr)
      return res.status(403).json({ success: false, message: "Invalid Token" });

    // This JOIN ensures to get the role_name
    const sql = `
      SELECT u.user_id, u.full_name, u.email, r.role_name 
      FROM users u 
      INNER JOIN roles r ON u.role_id = r.role_id 
      WHERE u.user_id = ?`;

    Db.query(sql, [UserData.id], (DbErr, Results) => {
      if (DbErr) return res.status(500).json(DbErr);
      if (Results.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      res.json({ success: true, user: Results[0] });
    });
  });
});

App.listen(3000, () => {
  console.log("Server running on port 3000");
});