const express = require('express');
const app = express();
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");

mongoose.connect("mongodb://localhost/urlShortner", {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    await ShortUrl.find({}, (err, urls) => {
        if(err)
            console.log(err);
        else{
            res.render("index", {urlList : urls});
        }
    })
})

app.post("/short", async (req, res) => {
    await ShortUrl.create({
        full: req.body.url
    })
    res.redirect("/");
})

app.get("/:shortUrl", (req, res) => {
    ShortUrl.findOne({short: req.params.shortUrl}, (err, foundUrl) => {
        if(err){
            console.log(err);
            console.log("there is an error");
        }
        else{
            foundUrl.clicks++;
            foundUrl.save();
            res.redirect(foundUrl.full);
        }
    })
})

app.listen("3000", () => {
    console.log("listening to port 3000");
})