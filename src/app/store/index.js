import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import * as sagas from "./saga";

const sagaMiddleware = createSagaMiddleware();
export const store = createStore(
  rootReducer,
  //defaultState,
  process.env.NODE_ENV == "production"
    ? applyMiddleware(sagaMiddleware)
    : applyMiddleware(createLogger(), sagaMiddleware),
);

for (let saga in sagas) {
  sagaMiddleware.run(sagas[saga]);
}
