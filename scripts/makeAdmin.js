// scripts/makeAdmin.js
// One-time helper: makes an existing account an admin so it can access /admin.html.
//
// Usage (from the project folder, in a terminal):
//   node scripts/makeAdmin.js youremail@example.com
//
// The account must already exist (sign up on the site first with that email),
// this script just flips its isAdmin flag to true.

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/makeAdmin.js youremail@example.com');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    console.error(`No account found with email "${email}". Sign up on the site first, then run this again.`);
    process.exit(1);
  }

  user.isAdmin = true;
  await user.save();
  console.log(`Done: ${user.email} is now an admin.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Failed:', err.message || err);
  process.exit(1);
});
