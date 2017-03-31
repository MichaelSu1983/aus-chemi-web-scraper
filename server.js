var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

//https://scotch.io/tutorials/scraping-the-web-with-node-js

//http://www.chemistwarehouse.com.au/search?searchtext=aptamil%20gold%203&searchmode=allwords

app.get('/scrape', function(req, res){
  var baseurl = 'http://www.chemistwarehouse.com.au';
  var categoryurl = '957/Baby-Formula';


  //var category = 'Vitamins';
  //
  //var categoryurl = '81'+ '/' + category;

  url = baseurl + '/Shop-OnLine/' + categoryurl + '?size=1200';

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      var products = {
        product: [],
      };

      $('#p_lt_ctl06_pageplaceholder_p_lt_ctl00_wPListC_lstElem').filter(function(){
        var j = 1;
        $('td').each(function(i, elem) {
          console.log("each item is: " + i);
          var iName = $(this).find('.product-container').find('.product-name').text();
          var name = $(this).find('.product-container').attr('title');
          var link = baseurl + $(this).find('.product-container').attr('href');

          var rawPrice = $(this).find('.product-container').find('.prices').text();

          if (rawPrice.search("\r\n  $$")) {
            var iPrice = rawPrice.substr(rawPrice.indexOf("\r\n  $") + 5, 5);
          }

          if (rawPrice.search("SAVE  $")) {
            var iSave = rawPrice.substr(rawPrice.indexOf("SAVE  $") + 6, 5);
          }


         if(iName.length > 0){
            products.product.push({
              "no" : j,
              "name" : name,
              "price" : iPrice,
              "save" : iSave,
              "link" : link

            })
           j++;
          }
        });

      })
    }

    var fileName = category + '_output.json';

    fs.writeFile(fileName, JSON.stringify(products, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for ' + fileName + ' file');
    })

    res.send('Check your console!')
  })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
