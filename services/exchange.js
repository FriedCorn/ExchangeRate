const request = require('request');

const getCurrencies = (callback) => {
   request('https://gist.githubusercontent.com/stevekinney/8334552/raw/28d6e58f99ba242b7f798a27877e2afce75a5dca/currency-symbols.json', {json: true}, (error, res, body) => {
      if (error) {
         callback(error, undefined);
         return;
      }
      callback(null, body);
   });  
}

const getRate = ({from, to}, callback) => {
   request('https://v6.exchangerate-api.com/v6/26e7fde53edfca59d2df111d/latest/USD', {json: true}, (error, res, body) => {
      if (error) {
         callback(error, undefined, undefined);
         return;
      }
      if (body.conversion_rates[from] == undefined) {
         callback("From-currency is not found", undefined, undefined);
         return;
      }
      if (body.conversion_rates[to] == undefined) {
         callback("To-currency is not found", undefined, undefined);
         return;
      }
      callback(null, body.conversion_rates[from], body.conversion_rates[to]);
   })
}
module.exports = {
   getCurrencies,
   getRate
}