exports.yeu_cau_dang_nhap = (req, res, next) => {
  if (req.session.user) {
    console.log("đã đăng nhập");
    next();
  } else {
    console.log("chưa đăng nhập");
    return res.render("authorize/authorize", {
      message: "Bạn phải đăng nhập để sử dụng chức năng này",
      req: req,
    });
  }
};

exports.yeu_cau_dang_nhap_admin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    return res.render("home/home", {
      message: "Bạn phải đăng nhập tài khoản Admin để sử dụng chức năng này",
      req: req,
    });
  }
};

exports.khong_yc_dang_nhap = (req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    return res.redirect("/users");
  }
};