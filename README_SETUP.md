# Live Chat — Setup Steps

## 1. Copy files into your project
- `LiveChat.js` → `models/LiveChat.js`
- `liveChatController.js` → `controllers/liveChatController.js`
- `liveChat.js` → `routes/liveChat.js`

## 2. Wire it into `server.js`
Add this line near the other `safeRequire(...)` calls:
```js
const liveChatRoutes = safeRequire('./routes/liveChat', 'live-chat');
```

Add this line near the other `if (xRoutes) app.use(...)` lines:
```js
if (liveChatRoutes) app.use('/api/live-chat', liveChatRoutes);
```

That's it — no other server.js changes needed. It reuses your existing
`GROQ_API_KEY` (already required for `/api/ai-chat`) and your existing
MongoDB connection.

## 3. Frontend
Drop `live-chat-widget.html` into your contact page (or include its
`<style>`/`<script>` in your existing page). Update the `API_BASE` constant
at the top of the script if your backend isn't on `http://localhost:4000`.

## 4. Test
```
POST http://localhost:4000/api/live-chat
Body: { "sessionId": "test-123", "message": "Hi, do you ship internationally?" }
```
You should get back `{ "reply": "...", "sessionId": "test-123" }`, and a new
document should appear in the `livechats` MongoDB collection.
