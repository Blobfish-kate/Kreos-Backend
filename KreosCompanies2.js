const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors")

const rp = require('request-promise');
const schedule = require('node-schedule')
const url = 'http://www.kreoscapital.com/portfolio/';

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))

let INVESTMENTS;

var job = schedule.scheduleJob({hour: 17, minute: 35, dayOfWeek: 2}, function() {
  rp(url)
  .then(function(html){
    INVESTMENTS = JSON.parse(
    	html.substring(html.indexOf('INVESTMENTS') + 13, html.indexOf("</script><div class=") - 2)
      );
  })
  .catch(function(err){
    throw(err);
  });
})

app.get("/", function(req, res){
	res.send(INVESTMENTS)
})

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log("Server connected to KreosScraper backend");
});