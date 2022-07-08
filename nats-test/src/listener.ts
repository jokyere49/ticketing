import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// each client has to have an id to stan
// in order to allow for multiple instances of listener
// to be created we will create a random id 
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true) //it allows us to manually acknowledge if the event sent was successfully received #297
    .setDeliverAllAvailable() // it sends a list of all events that has been emiited whenever u restart the listener
    .setDurableName('accounting-service'); // creates durable subscription
  // durable subscription  allows nats to keep track of what listener has already processed and not #306
  // use setDeliverAllAvailable together with setDurableNAme
  //setDeliverAllAvailable runs the first time we create the listener
  const subscription = stan.subscribe(
    'ticket:created',
    'queue-group-name', // handles the queue when we create multiple
    // instances of the listener #296
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();
    
    // this if statement to make sure data is string 
    // to make ts happy 
    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack(); // this is used to manually acknowledge the message has been received
  });
});

// we are looking at an interrupt or terminate signal
// if we receive we call stan.close() which terminate the subscription
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

abstract class Listener {
  // all with abstract tag must be defined in the child/subclass that inherites from the abstract class
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;
  private client: Stan; // can't be changed by the subclass
  protected ackWait = 5 * 1000; // protected means subclass can define it if it wants unit is ms

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data) // how handle it data is string ( covert to json)
      : JSON.parse(data.toString('utf8')); // how to handle if data is a buffer ( convert to json)
  }
}