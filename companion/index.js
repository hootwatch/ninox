import { peerSocket } from "messaging";

// const atheneURL = "https://eedc5914.ngrok.io/athene/vital";
const atheneURL = "https://davidcastaneda.lib.id/hoot@dev/receiveVitals/";

peerSocket.onopen = () => console.log("Connection opened.");

peerSocket.onmessage = e => {
  const vitals = e.data;

  fetch(atheneURL, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(vitals),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))
    .catch(e => console.log(e));
};

peerSocket.onerror = err =>
  console.log("Connection error: " + err.code + " - " + err.message);
