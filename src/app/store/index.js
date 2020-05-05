import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import * as sagas from "./saga";

const sagaMiddleware = createSagaMiddleware();
export const store = createStore(
  rootReducer,
  //defaultState,
  applyMiddleware(createLogger(), sagaMiddleware)
);

for (let saga in sagas) {
  sagaMiddleware.run(sagas[saga]);
}
