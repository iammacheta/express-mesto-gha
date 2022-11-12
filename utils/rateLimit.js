const rateLimit = require('express-rate-limit');

module.exports.limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 10 minute
  max: 1000, // Limit each IP to 1000 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
