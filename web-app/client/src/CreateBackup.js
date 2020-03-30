import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Text,
    TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux';
import { createBackup } from './actions/backup';

class CreateBackup extends Component {

    static navigationOptions = {
        title: 'Create New Backup',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#fff',
        },
    };

    state = {
        backupTitle: '',
        fileHash: '',
        filePath: '',
        fileName: '',
        backupDateTime: ''
    };

    handleInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        if (this.state.backupTitle.trim() && this.state.fileHash.trim() && this.state.filePath.trim() && this.state.fileName.trim() && this.state.backupDateTime.trim()) {
            console.log(this.state);
            this.handleReset();
        }
    };

    handleReset = () => {
        this.setState({
            backupTitle: '',
            fileHash: '',
            filePath: '',
            fileName: '',
            backupDateTime: ''
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Create New Backup</Text>
                <TextInput
                    value={this.state.backupTitle}
                    placeholder='Name Your Backup'
                    style={styles.foodInput}
                    // onChangeText={(food) => this.setState({ food })}
                    onChangeText={this.handleInputChange}
                />
                <TextInput
                    value={this.state.fileHash}
                    placeholder='IPFS Hash'
                    style={styles.foodInput}
                    onChangeText={this.handleInputChange}
                />
                <TextInput
                    value={this.state.filePath}
                    placeholder='Your file path'
                    style={styles.foodInput}
                    onChangeText={this.handleInputChange}
                />
                <TextInput
                    value={this.state.fileName}
                    placeholder="Your file's name"
                    style={styles.foodInput}
                    onChangeText={this.handleInputChange}
                />
                <TextInput
                    value={this.state.backupDateTime}
                    placeholder='The time the backup done'
                    style={styles.foodInput}
                    onChangeText={this.handleInputChange}
                />
                <TouchableOpacity
                    style={{ marginBottom: 16 }}
                    // onPress={() => {
                    //     this.props.add(this.state.food)
                    //     this.setState({ food: null })
                    // }}>
                    onPress={ this.handleSubmit }>
                    <Text style={{ fontSize: 22, color: '#5fc9f8' }}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ marginBottom: 16 }}
                    onPress={ this.handleReset }>
                    <Text style={{ fontSize: 22, color: '#5fc9f8' }}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ marginBottom: 16 }}
                    onPress={() =>
                        this.props.navigation.navigate('ElanHome')}>
                    <Text style={{ fontSize: 22 }}>Go to Elan Home</Text>
                </TouchableOpacity>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 64,
        marginBottom: 5
    },
    foodInput: {
        fontSize: 32,
        marginBottom: 32,
        borderWidth: 1,
        padding: 8,
        width: '80%',
        borderRadius: 10,
    }
});


// const mapStateToProps = (state) => {
//     console.log(state);
//     return {
//         backups: state.backupReducer.backupList
//     }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         add: (backup) => dispatch(createBackup(backup))
//     }
// }

export default CreateBackup;
