const express = require('express');
const request = require('request-promise');
const Brewery = require('../Beer/Brewery');
const state = require('../Beer/state.json');
const app = express();
const port = 3000;
const startUrl = 'https://api.openbrewerydb.org/breweries';

app.listen(port, function() {
	console.log('app started');
});
// route our app
app.get('/*', function(req, res) {
  state.forEach(state => {
    request(`${startUrl}?by_state=${state.name}`)
      .then( (data) => {
        data = JSON.parse(data);
        let brewery;
        let html = [];
        if (data.length != 0) {
          html += `<h2 align="center">${state.name}</h2>`;
          html += `<th>id</th><th>name</th><th>Full adress</th><th>phone</th><th>website_url</th>`;
          data.forEach(element => {
            if (element.brewery_type != 'micro') {
              brewery = new Brewery(element);
              html += `<tr>`
              html += `<td align="center">${brewery.id}`;
              html += `<td align="center">${brewery.name}`;
              html += `<td align="center">${brewery.getFullAddress()}`;
              html += `<td align="center">${brewery.phone}`;
              html += `<td align="center">${brewery.website_url}`;
              html += `</tr>`
            }
          });
          res.write(` <table border="1" style="width:100%">${html}</table>`); 
        }}).catch( (err) => {
        console.log(err);
              res.send('Error');
      }) 
  }); 
});