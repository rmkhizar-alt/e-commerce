// Centralized error handler - keeps every route's try/catch simple:
// just call next(err) and this formats a clean JSON response.
function errorHandler(err, req, res, next) {
  console.error('[error]', err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation failed', details: err.errors });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ error: `That ${field} is already in use.` });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid id format.' });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Something went wrong on our end.' });
}

function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };
