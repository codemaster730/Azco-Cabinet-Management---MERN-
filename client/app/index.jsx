import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { render } from "react-dom";
import App from "./components/App/App";
import "./styles/styles.scss";

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'

const store = createStore(rootReducer)

render(
    <Provider store={store}>
      <App />
    </Provider>,
  // eslint-disable-next-line no-undef
  document.getElementById("app")
);
