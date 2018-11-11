import { peerSocket } from "messaging";

// const atheneURL = "https://localhost:3000/athene/vital";
const atheneURL = "https://4558692d.ngrok.io/athene/vital";

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
