const createError = require("http-errors");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

require("dotenv").config();
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const caRouter = require("./routes/ca");
const cryptoRoute = require("./routes/crypto");
const mongoose = require("mongoose");
const File = require("./models/fileSchema");
const app = express();
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(
    "mongodb+srv://a-lex-pass:XKLZQPFC9_GrvJesY@cluster0.r0znqqp.mongodb.net/?retryWrites=true&w=majority"
  );
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// configure logger & some sequrity
app.use(logger("dev"));
app.disable("x-powered-by");

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/ca", caRouter);
app.use("/crypto", cryptoRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
