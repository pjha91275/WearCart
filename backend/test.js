const sequelize = require("./config/database");

sequelize.authenticate()
  .then(() => console.log("✅ Supabase DB connected"))
  .catch(err => console.error("❌ DB connection error:", err));
