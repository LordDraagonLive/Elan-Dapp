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
import { Card, Divider, CheckBox } from 'react-native-elements';


import Icon from 'react-native-vector-icons/FontAwesome';

import RNFS from 'react-native-fs';
import FilePickerManager from 'react-native-file-picker';

export class CreateBackup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            dataSource: null,
            singleFileOBJ: null,
            pickedFilesList:  <Text style={styles.sectionDescriptionRed}>No files are selected to be backed up!</Text>,
            backupTitle: "",
            messagesCheck: false,
            contactsCheck: false
        }
    }

    handleInput = (text) => {
        this.setState({ backupTitle: text })
        console.log(this.state.backupTitle)
    }

    handleMessages(){

      if (this.state.messagesCheck) {
        this.setState({ messagesCheck: false })
      } else {
        this.setState({ messagesCheck: true })
      }

    }
    handleContacts(){
      if (this.state.contactsCheck) {
        this.setState({ contactsCheck: false })
      } else {
        this.setState({ contactsCheck: true })
      }
    }

    // using npm install react-native-file-picker@latest --save
    async rnFilePicker() {

        FilePickerManager.showFilePicker(null, (response) => {
            console.log('Response = ', response.fileName);

            if (response.didCancel) {
                console.log('User cancelled file picker');
                alert('No files were picked!')
            }
            else if (response.error) {
                console.log('FilePickerManager Error: ', response.error);
            }
            else {
                this.setState({
                    singleFileOBJ: response
                });
                let records = <Card containerStyle={styles.card}>
                {/* <Text style={styles.sectionTitle}></Text> */}
                <Text style={styles.sectionDescription}>
                  Selected Files: 
                  
                </Text>
                <Text style={{ color: '#FFF', paddingHorizontal: 10 }}>{response.fileName},</Text>
                 </Card>

                this.setState({
                    pickedFilesList: records
                })
            }
        });
    }


  // Backup Selected files  
  async uploadToNode() {

    this.setState({ isLoading: true });

    let filePath = this.state.singleFileOBJ.path;
    let fileName = this.state.singleFileOBJ.fileName;
    let fileType = this.state.singleFileOBJ.type;

    let uploadURL = 'http://192.168.1.100:7171/uploadToIpfs';

    console.log(`Real Path: ${filePath}`);

    const uploadBegin = (response) => {
      const jobId = response.jobId;
      console.log('UPLOAD HAS BEGAN! JobId: ' + jobId);
    };

    const uploadProgress = (response) => {
      const percentage = Math.floor((response.totalBytesSent / response.totalBytesExpectedToSend) * 100);
      console.log('UPLOAD IS ' + percentage + '% DONE!');
    };

    RNFS.exists(filePath).then((response) => {
      console.log(response);
    });

    // var newRealPath = ((await RNFS.stat(filePath)).originalFilepath);
    // console.log(`New Real Path: ${newRealPath}`);

    setTimeout(() => {
      RNFS.uploadFiles({
        toUrl: uploadURL,
        files: [{
          name: 'file',
          filename: fileName,
          filepath: filePath,
          filetype: fileType,
        }],
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        begin: uploadBegin,
        beginCallback: uploadBegin,
        progressCallback: uploadProgress,
        progress: uploadProgress
      }).promise.then((response) => {
        console.log(response, "<<< Response");
        if (response.statusCode == 200) {
          console.log('Files Uploaded!');
          var jsonRes = JSON.parse(response.body).Backup;
          // console.log("Response file name: "+jsonRes.name);
          var fileHash = jsonRes.ipfsHash;
          this.uploadToHLF(fileName, filePath, fileHash);
        } else {
          console.log('Server ERROR!');
        }
      }).catch((err) => {
        if (err.description) {
          switch (err.description) {
            case "cancelled":
              console.log('Upload Cancelled');
              break;
            case "empty":
              console.log('Empty File');
            default:
              //UNKNOWN
              console.log('Error Unknown');
              break;
          }
        } else {
          // Weird
          console.log('Weird!');
          console.log(err);
        }
        console.log(err);
      });
    }, 2000);
    this.setState({ isLoading: false });
  }

  async uploadToHLF(fileName, filePath, fileHash) {
    var backupDateTime = new Date();
    var backupTitle = this.state.backupTitle;

    try {
      var response = await fetch('http://192.168.1.100:7171/createBackup', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          backupTitle,
          filePath,
          fileName,
          backupDateTime,
          fileHash
        }),
      });
      let json = await response.json();
      console.log(json);
      alert("Data Backup Successful!")
      return json;
    } catch (err) {
      console.error(err);
    }
  }



    render() {

        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView style={styles.scrollView}>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.scrollView}>
                           <ActivityIndicator animating={this.state.isLoading} />
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
                            <Text style={styles.sectionDescription}>Backup Title</Text>
                            <TextInput style={styles.input}
                                // underlineColorAndroid="trasparent"
                                autoCapitalize="none"
                                onChangeText={this.handleInput} />

                            <Text style={styles.sectionDescription}>Select files from File system</Text>

                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.submitButton}
                                onPress={this.rnFilePicker.bind(this)}>
                                <Text style={styles.submitButtonText}>
                                    File Picker
                                </Text>
                            </TouchableOpacity>

                            {this.state.pickedFilesList}

                            <CheckBox
                              title='Messages'
                              checked={this.state.messagesCheck}
                              iconRight
                              containerStyle={styles.checkbox}
                              textStyle={{ color: '#a9a9a9' }}
                              onPress={ () => this.handleMessages()}
                            />

                            <CheckBox
                              title='Contacts'
                              checked={this.state.contactsCheck}
                              iconRight
                              onPress={ () => this.handleContacts()}
                              textStyle={{ color: '#a9a9a9' }}
                              containerStyle={styles.checkbox}
                            />
                            <TouchableOpacity
                                style={styles.submitButton2}
                                onPress={
                                    () => this.uploadToNode()
                                }>
                                <Text style={styles.submitButtonText}> Create Backup </Text>
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
        paddingTop: 30,
        backgroundColor: '#303030',
    },
    sectionContainer: {
        marginTop: 42,
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
        paddingStart: 8,
        paddingTop: 20,

    },
    sectionDescriptionRed: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: '#FF0000',
        paddingStart: 8
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
        borderRadius: 20,
    },
    input: {
        margin: 15,
        height: 40,
        borderColor: '#fff',
        borderWidth: 2,
        color: '#fff'
    },
    checkbox: {
      margin: 15,
      height: 40,
      // borderColor: '#fff',
      // borderWidth: 2,
      width: 128,
      backgroundColor: '#212121'
  },
    submitButton: {
        backgroundColor: '#0066A2',
        padding: 10,
        margin: 15,
        height: 50,
    },
    submitButton2: {
        backgroundColor: '#0066A2',
        padding: 10,
        margin: 15,
        height: 50,
        marginTop: 50,
        marginBottom: 110
    },
    submitButtonText: {
        color: '#fff',
        textAlign: "center",
        fontSize: 18,
        fontWeight: '400',
    }
});