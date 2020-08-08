module.exports = (req, res) => {
  res.statusCode = 200;
  // const ip = req.connection.remoteAddress;
  const ip = req.headers["x-forwarded-for"]
  res.end(JSON.stringify(
    {ip, headers: req.headers},
    null,
    4
  ));
};
