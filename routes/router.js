const keyPair = process.env.KEY_PAIR_OPEN;

exports.api = {};

exports.form = (req, res) => {
  res.render("form", { keyPair });
};
