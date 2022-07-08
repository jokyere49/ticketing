import nats from 'node-nats-streaming';

console.clear();

// stan is the client to the nats 
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

// the below function will get executed after the stan
// has successfully connected to the client server
stan.on('connect', () => {
  console.log('Publisher connected to NATS');
  
  // before u send ur data to NATS streaming server
  // you have to convert it to json
  // data/event is referred to in the nats world as messages
  // 
  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });
});
