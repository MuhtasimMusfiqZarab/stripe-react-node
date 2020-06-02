import React, { useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';

function App() {
  const [product, setProduct] = useState({
    //initial setup of porduct
    name: 'Jeans',
    price: 10,
    productBy: 'Garnish',
  });

  //method for making payment //this methods can access token which is autometically created to us
  const makePayment = (token) => {
    //design the body
    const body = {
      token,
      product,
    };
    //design the header
    const headers = {
      //we are throwing some json
      'Content-Type': 'application/json',
    };

    //fire up a request to the backend
    return fetch(`http://localhost:8282/payment`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        console.log(response.status);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <StripeCheckout
        //StripeCheckout requores some things to pass on if you wanted to show up there
        //these are compolsary parameters
        stripeKey="pk_test_sXAFsQdi13ZcGJg32MBCjQXH00Q8zLlEMd"
        token={makePayment} //responsible for firing up somethings (fire simple methods like makePayment)
        //not madatory
        name="Buy pants"
        amount={product.price * 100}
        //if you want to insert address
        shippingAddress
        billingAddress
      >
        <button className="btn-large blue"> Buy with {product.price}</button>
      </StripeCheckout>
    </div>
  );
}

export default App;
