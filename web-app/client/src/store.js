import { createStore, combineReducers } from "redux";
import backupReducer from "./reducers/backupReducer";

const rootReducer = combineReducers({
    backups: backupReducer
})

const configureStore = () => createStore(rootReducer);


export default configureStore;
