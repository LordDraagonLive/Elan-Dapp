import { Query_All_Cars, Create_Backup, Query_Backup } from "../actions/types";

const initialState = []

const backupReducer = { state = initialState, action } => {
    switch (action.type) {
        // case Create_Backup:
        //     return {
        //         ...state,
        //     backupList: state.backupList.concat({
        //         key: Math.random(),
        //         data: action.data
        //     })}
        case Create_Backup:
            return [...state, action.payload];
        case Query_All_Cars:
            return action.backups;
        case Query_Backup:
            return action.backup;
        default:
            return state;
    }
}

export default backupReducer;
