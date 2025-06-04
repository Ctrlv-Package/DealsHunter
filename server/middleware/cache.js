const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

module.exports = function(keyGenerator) {
  return (req, res, next) => {
    const key = keyGenerator(req);
    const cached = cache.get(key);
    if (cached) {
      return res.json(cached);
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cache.set(key, data);
      originalJson(data);
    };
    next();
  };
};
