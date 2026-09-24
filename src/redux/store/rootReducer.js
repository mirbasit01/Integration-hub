import { combineReducers } from "redux";
import userReducer from "../reducer/userReducer";
import priceReducer from "../reducer/priceReducer";

const rootReducer = combineReducers({
  user: userReducer,
  prices: priceReducer,
});

export default rootReducer;
