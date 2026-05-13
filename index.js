import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const API_URL = "https://www.thecocktaildb.com/api/json/v1/1";

// Home Route
app.get("/", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/random.php");

    const drink = result.data.drinks[0];

    res.render("index.ejs", {
      cocktail: drink,
    });
  } catch (error) {
    console.log(error.message);

    res.render("index.ejs", {
      error: "Failed to fetch cocktail data.",
    });
  }
});

// Search Route
app.post("/search", async (req, res) => {
  const cocktailName = req.body.cocktail;

  try {
    const result = await axios.get(
      API_URL + `/search.php?s=${cocktailName}`
    );

    if (result.data.drinks === null) {
      return res.render("index.ejs", {
        error: "No cocktail found.",
      });
    }

    res.render("index.ejs", {
      cocktail: result.data.drinks[0],
    });
  } catch (error) {
    console.log(error.message);

    res.render("index.ejs", {
      error: "Something went wrong.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});