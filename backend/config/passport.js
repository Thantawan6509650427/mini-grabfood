import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "../db.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const picture = profile.photos[0]?.value;

        // ตรวจสอบว่ามี user อยู่แล้วหรือไม่
        const [existingUsers] = await pool.query(
          "SELECT * FROM users WHERE google_id = ?",
          [googleId]
        );

        let user;
        if (existingUsers.length > 0) {
          // อัพเดทข้อมูล user
          user = existingUsers[0];
          await pool.query(
            "UPDATE users SET name = ?, picture = ?, last_login = NOW() WHERE id = ?",
            [name, picture, user.id]
          );
        } else {
          // สร้าง user ใหม่
          const [result] = await pool.query(
            "INSERT INTO users (google_id, email, name, picture) VALUES (?, ?, ?, ?)",
            [googleId, email, name, picture]
          );
          user = {
            id: result.insertId,
            google_id: googleId,
            email,
            name,
            picture,
          };
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    done(null, users[0]);
  } catch (error) {
    done(error, null);
  }
});

export default passport;