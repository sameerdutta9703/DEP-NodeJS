var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/user', function (req, res, next) {
  res.status(200).json({ username: "sameerdutta97", age: 20, email: "sameerdutta9703@gmail.com", name: "Sameer Dutta" });
});

module.exports = router;
