const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/routes.js");
const { default: mongoose } = require("mongoose");
const{routes}=require("express")
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://avijithazra1234:Techno16@cluster0.b7ob9.mongodb.net/practice3-DB",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));


app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});