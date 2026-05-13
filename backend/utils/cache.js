const NodeCache = require('node-cache');

// Standard cache for API results (TTL: 24 hours)
const apiCache = new NodeCache({ stdTTL: 86400, checkperiod: 600 });

// Shorter cache for dynamic data (TTL: 1 hour)
const dynamicCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

module.exports = {
  apiCache,
  dynamicCache
};
