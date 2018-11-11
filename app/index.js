import document from "document";
import { peerSocket } from "messaging";
import { HeartRateSensor } from "heart-rate";
import { Barometer } from "barometer";
import { Accelerometer } from "accelerometer";
import { vibration } from "haptics";

const hrm = new HeartRateSensor();
const bar = new Barometer();
const accel = new Accelerometer();

hrm.start();
bar.start();
accel.start();

const hrmData = document.getElementById("hrm-data");
const barData = document.getElementById("bar-data");
const accelData = document.getElementById("accel-data");

let avg = [];

peerSocket.onerror = err =>
  console.log("Connection error: " + err.code + " - " + err.message);

const sendMessage = () => {
  const heartRate = hrm.heartRate ? hrm.heartRate : 0;
  const barometer = bar.pressure ? parseInt(bar.pressure) : 0;
  const accelerometer = {
    x: accel.x ? accel.x.toFixed(1) : 0,
    y: accel.y ? accel.y.toFixed(1) : 0,
    z: accel.z ? accel.z.toFixed(1) : 0
  };

  let getAvg = heartRate;
  if (avg.length < 20) {
    avg.push(heartRate);
  } else {
    getAvg = avg.reduce((a, b) => a + b, 0);

    if (getAvg / 20 > 100 || (getAvg / 20 < 70 && getAvg != undefined)) {
      vibration.start("nudge-max");
    } else {
      vibration.stop();
    }

    avg.shift();
    avg.push(heartRate);
  }

  const vitals = { heartRate, barometer, accelerometer };

  if (peerSocket.readyState === peerSocket.OPEN) {
    peerSocket.send(vitals);
  }

  if (peerSocket.readyState === peerSocket.CLOSED) {
    console.log("Connection closed");
  }
};

sendMessage();
setInterval(sendMessage, 1000);
