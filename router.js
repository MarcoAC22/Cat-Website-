const axios = require("axios");
const express = require("express");
const Breed = require("./Breed");
const Fact = require("./Fact");
const router = express.Router();
const mongoose = require("mongoose");

const facts = require("./cat_facts.json");
const breeds = require("./cat_breeds.json");
router.get("/breeds", async (req, res) => {
  const breeds = await Breed.find();
  await Promise.all(
    breeds[0].data.map(async (element) => {
      await axios
        .get(element.image)
        .then(function (res) {
          element.image = res.request.res.responseUrl;
        });
    })
  );
  res.render("pages/breeds/index", { breeds: breeds[0].data });
});
router.get("/breeds/:breedid", async (req, res)=>{
  const breeds = await Breed.findOne({data:{$elemMatch:{breed:req.params.breedid}}}, 
    {"data.$": 1, name:1})
    res.render("pages/breeds/details", {breed:breeds.data[0]})
}
)
router.get("/facts", async (req, res) => {
  const facts = await Fact.find();
  res.render("pages/facts/index", { facts: facts[0].data });
});

router.post("/facts", async (req, res) => {
  const fact = new Fact(facts);
  await fact.save();
  res.send(fact);
});
router.post("/breeds", async (req, res) => {
  const breed = new Breed(breeds);
  await breed.save();
  res.send(breed);
});

router.post("/update", async (req, res) => {
  Breed.schema.add({
    data: [
      {
        image: {
          type: String,
          default: "https://thecatapi.com/api/images/get?format=src&type=gi",
        },
      },
    ],
  });
  const breeds = await Breed.find();
  breeds.map((br) => {
    br.save();
  });
  res.send(breeds);
});

router.get("/", async (req, res) => {
  const breeds = await Breed.find();

  console.log(breeds);
  let breed = breeds[0].data[Math.floor(Math.random() * breeds[0].data.length)];
  const facts = await Fact.find();
  let fact = facts[0].data[Math.floor(Math.random() * facts[0].data.length)];

  res.render("pages/index", { breed: breed, fact: fact });
});

module.exports = router;
