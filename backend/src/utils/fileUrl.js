const buildFileUrl = (req, filename) => {
  if (!filename) return null;
  if (/^https?:\/\//i.test(filename)) return filename;
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

module.exports = {
  buildFileUrl,
};
