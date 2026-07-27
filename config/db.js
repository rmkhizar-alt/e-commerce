const mongoose = require('mongoose');

// Tracks whether Mongo is actually connected right now, so the rest of the
// app (product routes, live chat, ai-chat, etc.) can check this BEFORE
// making a query and skip straight to a safe fallback instead of throwing.
let dbReady = false;

async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and fill it in.');
  }
  mongoose.set('strictQuery', true);

  // By default, Mongoose queues up ("buffers") any query made while the DB
  // isn't connected, and only gives up after 10 seconds - that's exactly the
  // "buffering timed out after 10000ms" delay other parts of the app were
  // hitting on every request while MongoDB was unreachable. Turning buffering
  // off makes any query fail INSTANTLY with a clear "not connected" error
  // when the DB is down, instead of hanging for 10s first.
  mongoose.set('bufferCommands', false);

  mongoose.connection.on('connected', () => {
    dbReady = true;
    console.log('[db] status: connected');
  });
  mongoose.connection.on('disconnected', () => {
    dbReady = false;
    console.warn('[db] status: disconnected — DB-dependent features will use fallbacks until it reconnects.');
  });
  mongoose.connection.on('error', (err) => {
    dbReady = false;
    console.error('[db] connection error:', err.message);
  });

  await mongoose.connect(uri, {
    // Give up trying to reach the cluster after 5s instead of the ~30s
    // default, so a bad connection string / network issue is reported fast.
    serverSelectionTimeoutMS: 5000
  });
  console.log('[db] MongoDB connected:', mongoose.connection.host);
  return mongoose.connection;
}

// Call this before any DB query anywhere in the app. If it returns false,
// skip the query and return an empty/fallback result instead of letting
// Mongoose throw a "not connected" error.
function isDbReady() {
  return dbReady;
}

module.exports = { connectDB, isDbReady };
