import { Query_All_Backups, Create_Backup, Query_Backup } from "./types";
import axios from 'axios';


// export const createBackup = (backup) => (
//     {
//         type: Create_Backup,
//         data: backup
//     }
// );

const apiUrl = 'http://localhost:8081';

export const createBackup = ({ backupTile, filePath, fileName, backupDateTime, fileHash}) => {
    return (dispatch) => {
        return axios.post(`${apiUrl}/createBackup`, { backupTile, filePath, fileName, backupDateTime, fileHash})
            .then(response => {
                dispatch(createBackupSuccess(response.data))
            })
            .catch(error => {
                throw (error);
            });
    };
};

export const createBackupSuccess = (data) => {
    return {
        type: Create_Backup,
        payload: {
            _id : data._id,
            backupTitle: data.backupTile,
            fileHash: data.fileHash,
            filePath: data.filePath,
            fileName: data.fileName,
            backupDateTime: data.backupDateTime
        }
    }
};

export const queryBackups = (backups) => {
    return {
        type: Query_All_Backups,
        backups
    }
};

export const queryAllBackups = () => {
    return (dispatch) => {
        return axios.get(`${apiUrl}/queryAllBackups`)
            .then(response => {
                dispatch(queryBackups(response.data))
            })
            .catch(error => {
                throw (error);
            });
    };
};

export const queryBackup = (backup) => {
    return {
        type: Query_Backup,
        backup
    }
};

export const querySingleBackup = (key) => {
    return (dispatch) => {
        return axios.get(`${apiUrl}/queryBackup`, key)
            .then(response => {
                dispatch(queryBackup(response.data))
            })
            .catch(error => {
                throw (error);
            });
    };
};

// export const deletePostSuccess = id => {
//     return {
//         type: DELETE_POST,
//         payload: {
//             id
//         }
//     }
// }

// export const deletePost = id => {
//     return (dispatch) => {
//         return axios.get(`${apiUrl}/delete/${id}`)
//             .then(response => {
//                 dispatch(deletePostSuccess(response.data))
//             })
//             .catch(error => {
//                 throw (error);
//             });
//     };
// };
