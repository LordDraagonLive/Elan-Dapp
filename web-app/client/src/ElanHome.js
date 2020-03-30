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

class ElanHome extends Component {

    static navigationOptions = {
        title: 'Home',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#fff',
        },
    };

    state = {
        backup: null
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Redux</Text>
                <TextInput
                    value={this.state.food}
                    placeholder='Name'
                    style={styles.foodInput}
                    onChangeText={(food) => this.setState({ food })}
                />
                <TouchableOpacity
                    style={{ marginBottom: 16 }}
                    onPress={() => {
                        this.props.add(this.state.food)
                        this.setState({ food: null })
                    }}>
                    <Text style={{ fontSize: 22, color: '#5fc9f8' }}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ marginBottom: 16 }}
                    onPress={() =>
                        this.props.navigation.navigate('FoodList')}>
                    <Text style={{ fontSize: 22 }}>Go to FoodList</Text>
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
        marginBottom: 48
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


const mapStateToProps = (state) => {
    console.log(state);
    return {
        backups: state.backupReducer.backupList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        add: (backup) => dispatch(createBackup(backup))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ElanHome);
