import React from 'react';
import ReactDOM from 'react-dom';
import Timer from './Timer';
import * as serviceWorker from './serviceWorker';

const DUMMY = {
  avg: [
    { ms: 19824, pen: undefined },
    { ms: 9492, pen: undefined },
    { ms: 46456, pen: undefined }
  ],
  history: [
    [
      { ms: 5, pen: undefined },
      { ms: 43, pen: undefined },
      { ms: 8, pen: undefined },
      { ms: 9, pen: undefined },
      { ms: 89, pen: undefined }
    ],
    [
      { ms: 87, pen: undefined },
      { ms: 9898, pen: undefined },
      { ms: 0, pen: undefined },
      { ms: 32, pen: undefined },
      { ms: 448, pen: undefined }
    ]
  ]
};

ReactDOM.render(
    <Timer />,
    document.getElementById('root')
    );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
