const fs = require('fs');
const _ = require('lodash');

const fileName = 'data';
let interval;


// method to start interval loop that generates data
function start() {
  // 'touch' file
  fs.openSync(fileName, 'a+', (err, fd) => {
    err ? console.log(err) : fs.close(fd);
  });
  /*
    Random event generation.
    Generates random streaming events in range from 1st March till current date with 10 sec interval.
  */
  interval = setInterval(() => {
    const eventCount = _.random(1, 5);
    console.log('tick', Date.now());
    // Min date set to 1st March 2019
    const startStreamTimeMin = 1551398400;
    const newData = _.times(eventCount, () => {
      const currentTime = Math.round(Date.now() / 1000);
      // generate random timestamp for stream start (not in future)
      const streamStartedOn = _.random(startStreamTimeMin, currentTime);
      const startedTillNowDifference = currentTime - streamStartedOn;
      /* generate random seconds streamed (can't be streamed to future).
      /  max length would be around 10 min so to be more realistic.
      /  (from my point of view, lol. Maybe regular user listens 1 track for hours. Who am I to judge)
      */
      const secondsStreamed = _.random(1, startedTillNowDifference < 10 * 60 ? startedTillNowDifference : 10 * 60);
      return {
        user_id: `user${_.random(1, 3)}`, // can be either user1, user2 or user3
        track_id: `track${_.random(1, 3)}`, // can be either track1, track2 or track3
        label: `label${_.random(1, 3)}`, // can be either label1, label2 or label3
        stream_started_on: streamStartedOn, // represents when the track began streaming (Unix time)
        seconds_streamed: secondsStreamed, // represents total numbers of seconds streamed
      };
    });
    const rawData = fs.readFileSync(fileName).toString();
    const data = rawData !== '' ? JSON.parse(rawData) : [];
    fs.writeFileSync(fileName, JSON.stringify([...data, ...newData], null, 2));
  }, 10000);
}

// clear data file
function clear() {
  // 'touch' file
  fs.openSync(fileName, 'a+', (err, fd) => {
    err ? console.log(err) : fs.close(fd);
  });

  fs.writeFileSync(fileName, JSON.stringify([], null, 2));
}

// get data from data file
function get() {
  // 'touch' file
  fs.openSync(fileName, 'a+', (err, fd) => {
    err ? console.log(err) : fs.close(fd);
  });
  const rawData = fs.readFileSync(fileName).toString();
  return JSON.parse(rawData);
}

// method to stop interval loop that generates data
function stop() {
  clearInterval(interval);
}

module.exports = {
  start, clear, get, stop,
};
