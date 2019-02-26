const { Producer, Consumer, KafkaClient } = require('kafka-node');

const host = process.env.KAFKA_HOST || 'localhost';
const port = '9092';
const pingTopic = 'ping';
const pongTopic = 'pong';

// Set up ping producer, publish messages
const pingProducerClient = new KafkaClient({kafkaHost: `${host}:${port}`}),
      pingProducer = new Producer(pingProducerClient),
      payloads = [
          { topic: pingTopic, messages: `first`, partition: 0 }
      ];
pingProducer.on('ready', function () {
    pingProducer.send(payloads, function (err, data) {
        if (err) console.error(err);
        console.log('Begin game');
        console.log(data);
    });
});
pingProducer.on('error', function (err) {
    console.error(err);
});

// Set up pong producer, publish messages
const pongProducerClient = new KafkaClient({kafkaHost: `${host}:${port}`}),
      pongProducer = new Producer(pongProducerClient);
pongProducer.on('ready', function () {
    const payloads = [
        { topic: pongTopic, messages: `first`, partition: 0 }
    ];
    pingProducer.send(payloads, function (err, data) {
        if (err) console.error(err);
        console.log('Begin game');
        console.log(data);
    });
});
pongProducer.on('error', function (err) {
    console.error(err);
});


// Set up ping consumer
const pingConsumerClient = new KafkaClient({kafkaHost: `${host}:${port}`}),
      pingConsumer = new Consumer(
        pingConsumerClient,
        [
            { topic: pingTopic, partitions: 0 }
        ],
        {
            autoCommit: false
        }
      );

pingConsumer.on('message', function (message) {
    if (message.value === 'ping' || message.value == 'first') {
        console.log(`${message.value} at ${new Date().toUTCString()}`);
        setTimeout(() => {
            const payloads = [
                { topic: pongTopic, messages: `pong`, partition: 0 }
            ];
            pongProducer.send(payloads, function (err, data) {
                if (err) console.error(err);
            });
        }, 1000);
    }
});

// Set up pong consumer
const pongConsumerClient = new KafkaClient({kafkaHost: `${host}:${port}`}),
      pongConsumer = new Consumer(
        pongConsumerClient,
        [
            { topic: pongTopic, partitions: 0 }
        ],
        {
            autoCommit: false
        }
      );

pongConsumer.on('message', function (message) {
    if (message.value === 'pong') {
        console.log(`${message.value} at ${new Date().toUTCString()}`);
        setTimeout(() => {
            const payloads = [
                { topic: pingTopic, messages: `ping`, partition: 0 }
            ];
            pingProducer.send(payloads, function (err, data) {
                if (err) console.error(err);
            });
        }, 1000);
    }
});