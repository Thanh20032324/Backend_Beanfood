var express = require("express");
const session = require("express-session");
const { yeu_cau_dang_nhap } = require("../middleware/checklogin");
var router = express.Router();

/* GET home page. */
router.get("/", yeu_cau_dang_nhap);
router.get("/addProduct", function (req, res, next) {
  res.render("product/addProduct", { title: "Express", req: req });
});
router.get("/showProduct", function (req, res, next) {
  res.render("product/showProduct", { title: "Express" });
});
router.get("/editProduct", function (req, res, next) {
  res.render("product/editProduct", { title: "Express" });
});
router.get("/home", function (req, res, next) {
  res.render("home", { title: "Express" });
});

module.exports = router;
