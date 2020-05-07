// CreateBackup.js

import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    ActivityIndicator,
    Button,
    TouchableOpacity,
    TextInput
} from 'react-native';
import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { FlatHeader, Group } from "react-native-flat-header";

import Icon from 'react-native-vector-icons/FontAwesome';


export class CreateBackup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: null
        }
    }

    async handleInput(){
        
    }



    render() {
        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView style={styles.scrollView}>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.scrollView}>
                        <FlatHeader
                            leftIcon={<Icon name="list" size={20} color="#FFF" />}
                            leftText="Backups"
                            leftContentHandler={() => {
                                this.props.navigation.navigate('backups')
                            }}
                            centerContent={
                                <Group>
                                    <Icon name="plus" size={20} color="#FFF" />

                                    <Text style={{ color: '#FFF', paddingHorizontal: 5 }}>Add</Text>
                                </Group>
                            }
                            centerContentHandler={() => {
                                this.props.navigation.navigate('createBackup')
                            }}
                            rightIcon={<Icon name="history" size={20} color="#FFF" />}
                            rightText="Schedule"
                            style={{ marginTop: 20, backgroundColor: '#212121' }}
                        />
                        {/* <Header /> */}
                        {global.HermesInternal == null ? null : (
                            <View style={styles.engine}>
                                <Text style={styles.footer}>Engine: Hermes</Text>
                            </View>
                        )}
                        <View style={styles.body}>
                            <TextInput style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="Email"
                                placeholderTextColor="#fff"
                                autoCapitalize="none"
                                onChangeText={this.handleInput} />

                            <TextInput style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="Password"
                                placeholderTextColor="#fff"
                                autoCapitalize="none"
                                onChangeText={this.handlePassword} />

                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={
                                    () => this.login(this.state.email, this.state.password)
                                }>
                                <Text style={styles.submitButtonText}> Submit </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        )
    }
}

export default CreateBackup


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#212121',
        alignItems: "center",
        justifyContent: "center"
    },
    scrollView: {
        backgroundColor: '#212121',
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: '#303030',
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
        color: Colors.lighter

    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.lighter,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.lighter,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
    card: {
        backgroundColor: '#212121',
        borderWidth: 0,
        borderRadius: 20
    }
});