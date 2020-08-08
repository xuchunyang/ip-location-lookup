const net = require("net");
const dns = require("dns");

// https://github.com/ipinfo/node#javascript
const IPinfo = require("node-ipinfo");
const token = "8c21823ec81275";
const ipinfo = new IPinfo(token);

function dnsLookup(hostname) {
  return new Promise((resolve, reject) => {
    dns.lookup(hostname, (err, address, family) => {
      err ? reject(err) : resolve(address);
    });
  });
}

async function getIP(req) {
  // q can be URL or domain or IP
  const { q } = req.query;
  if (!q) return req.headers["x-forwarded-for"];
  if (net.isIP(q)) return q;

  let domain = q;
  try {
    const url = new URL(q);
    domain = url.hostname;
  } catch (_e) {
  };

  return dnsLookup(domain);
}

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  
  if (req.query.q) {
    res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
  }
  
  getIP(req)
    .then(ip => {
      res.statusCode = 200;
      ipinfo.lookupIp(ip)
        .then((response) => {
          res.end(JSON.stringify(
            response,
            null,
            4
          ));
        })
    })
    .catch(error => {
      res.statusCode = 400;
      res.end(JSON.stringify(
        {
          name: error.name,
          message: error.message
        },
        null,
        4));
    })
};
