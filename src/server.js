const express = require('express');

const hbs = require('express-handlebars');

const path = require('path');
const { getCurrencies, getRate } = require('../services/exchange');

const app = express();
const port = process.env.PORT || 3000;

app.engine('handlebars', hbs());
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
   const amount = req.query.amount;
   const from_currency = req.query.from;
   const to_currency = req.query.to;

   if (!amount) {
      getCurrencies((error, body) => {
         if (error) {
            res.render('error', { error });
            return;
         }
         message = "Please input a number";
         res.render('home', { body, message });
         return;
      });
   }
   else {
      getCurrencies((error, body) => {
         if (error) {
            res.render('error', { error });
            return;
         }
         if (isNaN(amount)) {
            message = "Please input a number"
            res.render('home', {body, message});
            return;
         }
         getRate({ from: from_currency, to: to_currency }, (error, from_unit_base_usd, to_unit_base_usd) => {
            if (error) {
               res.render('home', { body, error });
               return;
            }
            result = to_unit_base_usd * amount / from_unit_base_usd;
            from_rate = from_unit_base_usd/to_unit_base_usd;
            to_rate = 1/from_rate;
            res.render('home', { body, amount, result, from_currency, to_currency, from_rate, to_rate });
            return;
         });
      });
   }
});

app.listen(port, () => {
   console.log(`Example app listening at http://localhost:${port}`);
});