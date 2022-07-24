import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const {doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body:{
      title, price
    },
    // redirect to the home page after submitting it 
    onSuccess: () => Router.push('/')
  });

  const onSubmit = (event) =>{
    event.preventDefault();

    doRequest();

  }

  // onblur is tragged in the user clicks the form input and click out
  //  this is to make sure the price the user entered  is in dollars
  //that is only 2 decimal places
  const onBlur = () => {
    // receives the user value from user
    const value = parseFloat(price);

    // check if the value user gave is a number if it is not
    //just return
    if (isNaN(value)) {
      return;
    }

    // if it is a number then u round it off
    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
