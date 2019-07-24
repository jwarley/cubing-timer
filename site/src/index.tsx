import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import * as firebase from "firebase/app";
import Timer from "./Timer";

var firebaseConfig = {
  apiKey: "AIzaSyDwiz-hIBeojGWqnk6rE7Ao3b7LS9-Wg6g",
  authDomain: "timer-v0.firebaseapp.com",
  databaseURL: "https://timer-v0.firebaseio.com",
  projectId: "timer-v0",
  storageBucket: "timer-v0.appspot.com",
  messagingSenderId: "998055254824",
  appId: "1:998055254824:web:3149843957307226"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(<Timer />, document.getElementById("root"));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
