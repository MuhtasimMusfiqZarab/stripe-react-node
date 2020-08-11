const cors = require('cors'); //cross object references
const express = require('express');
//TODO add a stripe key
const stripe = require('stripe')('sk_test_OuZCKif0AVfcaEdv1UbYRgFT00add9j9Vn');
const uuid = require('uuid');

//initializing app---------------------------------------------------------------------------------
const app = express();

//injecting middlewares-----------------------------------------------------------------------------
app.use(express.json()); //this handles json format data for processing manythings like req.body
app.use(cors());

//routes--------------------------------------------------------------------------------------------
app.get('/', (req, res) => res.send('It works at my website'));

//---post route where we are charging the customer
app.post('/payment', (req, res) => {
  //we need to pass a token from the frontend for the configuration (token consists of all the information we need and we can toss on inside of token)
  const { product, token } = req.body;
  console.log('PRODUCT', product);
  console.log('PRICE', product.price);

  //unique key (this unique key keeps track that user is not charged twice)
  const idempotencyKey = uuid.v4();

  //fireup the stripe route ,helps to create customers
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      //then create a charge
      //inside create we will be providing all the  object we are worried about,
      //in the 1st object we can extract as mush info as we like(some of them are compulsory and some of them are upto me) and 2nd obj contains idempontencykey
      stripe.charge.create(
        {
          //this are compulsoty (1st three are compulsory)
          amount: product.price * 100,
          currency: 'usd',
          customer: customer.id,
          //in case you want to sned an email to the customer once he is charged then write this
          receipt_email: token.email,
          //we will use description and shipping (not mandatory)
          description: `purchase of product.name`,
          //this is sake of fun (take all the shipping info directly into the  stripe)
          shipping: {
            name: token.card.name, //the stripe interface will give you a card element, the card you can ask the user that hey that is your shipping address/biling address and you can grab information from there
            address: {
              //we weiil now only grab one info, but you can grab more on your own
              country: token.card.address_country,
            },
          },
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((error) => console.log(error));
});

//listner-------------------------------------------------------------------------
app.listen(5000, () => console.log('listening at post 8282'));
