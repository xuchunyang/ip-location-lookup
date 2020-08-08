module.exports = (req, res) => {
  res.statusCode = 200;
  const ip = req.connection.remoteAddress;
  res.end(ip);
};
