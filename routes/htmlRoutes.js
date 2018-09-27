var db = require("../models");

module.exports = function(app, request, cheerio) {
  // Load index page
  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request("https://old.reddit.com/r/news/", function(error, response, html) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
      var currentArticles = [];
    db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
    currentArticles = dbArticle
    console.log(currentArticles)
    
      // Now, we grab every h2 within an article tag, and do the following:
      $("p.title").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(element).text();
        result.link = $(element).children().attr("href");
        
        var match = false;
        // Create a new Article using the `result` object built from scraping
        for(i=0; i<currentArticles.length; i++) {
          if(result.title === currentArticles[i].title) {
            match = true;
          };
        }
          if (match !== true) {
            db.Article.create(result)
            .then(function(dbArticle) {
              // View the added result in the console
              console.log(dbArticle);
            })
            .catch(function(err) {
              // If an error occurred, send it to the client
              return res.json(err);
            });
          }
          match = false;
            
      });
  
      // If we were able to successfully scrape and save an Article, send a message to the client
      res.send("Scrape Complete");
    });
  })
  });
  
  app.get("/", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.render("index", {article: dbArticle});
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  app.get("/test", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
