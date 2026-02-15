import jwt from "jsonwebtoken";

export const googleCallback = (req, res) => {
  // สร้าง JWT token
  const token = jwt.sign(
    { 
      id: req.user.id, 
      email: req.user.email,
      name: req.user.name 
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Redirect กลับไปหน้า frontend พร้อม token
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ success: true, message: "Logged out successfully" });
  });
};

export const getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.user);
};