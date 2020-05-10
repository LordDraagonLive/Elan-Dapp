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
} from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

import { Card, Divider } from 'react-native-elements';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { FlatHeader, Group } from "react-native-flat-header";
import Icon from 'react-native-vector-icons/FontAwesome';

import RNFS from 'react-native-fs';

/// Backups class handles viewing the data backups and restoring the backups
export class Backups extends Component {
 
    // URL's that are used
    queryAllBackups = "http://192.168.1.101:7171/queryAllBackups";
    queryFileIPFS = "http://192.168.1.101:7171/queryFileIPFS?key=QmZckVGtwsEechjvPsxT83MuqaB9GFPh2HK85SZuJSbTjw&filename=20200330_054538.jpg";
    createBackup = "http://192.168.1.101:7171/createBackup"
  
  
  // constructor, call the getAllBackups function everytime
  // to refresh the list
    constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        dataSource: null
      }
      this.getAllBackups();
    }

    // refresh the backups list everytime focus is gained
    componentDidMount() {
      this.focusListener = this.props.navigation.addListener('focus',
          () => this.getAllBackups())
    }
  
  
    // downloads backup details and set them to
    // the data soruce obj
    async getAllBackups() {
      return fetch(this.queryAllBackups)
        .then((response) => response.json())
        .then((res) => {
          this.setState({
            isLoading: false,
            dataSource: res,
          })
          // console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
    }

    // Uses the URL to get the selcted backuo and 
    // restore it in the file system
    async downloadBackup(record) {

      // extract reccord details
      let hash = record.fileHash.split('/')
      // console.log(hash[4])
      hash = hash[4];
      let filePath = record.filePath;
      let fileName = record.fileName;
      // console.log(hash)

      // var downloadUrl = 'http://192.168.1.101:8080/ipfs/QmZckVGtwsEechjvPsxT83MuqaB9GFPh2HK85SZuJSbTjw';
      // var downloadUrl = 'http://192.168.1.101:7171/queryFileIPFS?key=QmZckVGtwsEechjvPsxT83MuqaB9GFPh2HK85SZuJSbTjw&filename=20200330_054538.jpg';
      var downloadUrl = 'http://192.168.1.101:7171/queryFileIPFS?key='+hash +'&filename='+fileName;
      // var filePath = "/storage/emulated/0/DCIM/Screenshots/Screenshot_20200501-131323_YouTube.jpg";
      // var filePath = "/storage/326E-0FE2/DCIM/Camera/20200330_054538.jpg";
      // var fileURI = "file://com.android.providers.media.documents/document/image%3A8643";
      var fileURI = "content://com.android.providers.media.documents/document/image%3A11618";
      // var fileName = "20200330_054538.jpg";
  
      try {
        // let options = {
        //   fromUrl: downloadUrl,
        //   toFile: filePath,
        //   begin: (res) => {
        //     console.log(res)
        //   },
        //   progress: (data) => {
        //     console.log(data)
        //   },
        //   background: true,
        //   progressDivider: 1
        // }
        // console.log(options)
        // const request = await RNFS.downloadFile(options).promise
        // console.log(request)
        // Rn fs download file
        RNFS.downloadFile({
          fromUrl: downloadUrl,
          toFile: filePath,
          background: true,
  
        }).promise.then((res) => {
          console.log('result In');
          console.log(res);
  
          RNFS.exists(filePath).then((exists) => {
  
            console.log(exists);
            console.log('exists');
            alert('Backup Restored successfully\n File path:'+filePath)
  
          });
        }).catch((e) => {
          // return Promise.reject(e);
          console.log('promise returned!');
          // console.log(e);
          // alert('Backup Restored successfully\n File path:'+filePath)
  
        });
  
      } catch (e) {
        console.log(e)
      }
    }
  
  
    // Render the view
    render() {
      // display loading icon
      if (this.state.isLoading) {
        return (
          <View style={styles.container}>
            <ActivityIndicator />
          </View>
        )
      } else {
  
        let fDate;
        let records = this.state.dataSource.map((val, key) => {
          // return <View key={key} style={styles.sectionContainer}>
          //   <Text style={styles.sectionTitle}>{val.Record.backupTitle}</Text>
          // </View>
          // <View style={styles.sectionContainer}>
          //           <Text style={styles.sectionTitle}>See Your Changes</Text>
          //           <Text style={styles.sectionDescription}>
          //             <ReloadInstructions />
          //           </Text>
          //         </View>
          // console.log(new Date(val.Record.backupDateTime));
          try {
            fDate=(new Date(val.Record.backupDateTime))
          } catch (error) {
            fDate = "";
          }
  
          // FOrmat date time
          fDate = (fDate).toDateString() + " " + fDate.getUTCHours()+":"+fDate.getMinutes();
  
          return <Card key={key} containerStyle={styles.card} data-key={val.Key} data-fileHash={val.Record.fileHash} data-filePath={val.Record.filePath}>
            <Text style={styles.sectionTitle}>{val.Record.backupTitle}</Text>
            <Text style={styles.sectionDescription}>
              Files: 
              
            </Text>
            <Text style={{ color: '#FFF', paddingHorizontal: 10 }}>{val.Record.fileName},</Text>
            <Text style={{ color: '#FFF', paddingHorizontal: 10 }}>Contacts,</Text>
            <Text style={{ color: '#FFF', paddingHorizontal: 10 }}>Messages,</Text>
  
            <Text style={styles.sectionDescription}>
              Backup Date/Time: 
            </Text>
            <Text style={{ color: '#FFF', paddingHorizontal: 10, paddingBottom:5 }}>{fDate},</Text>
  
            <Button
                title="Restore"
                color="#0066A2"
                onPress={() => this.downloadBackup(val.Record)}
              />
          </Card>
        });
  
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
                  {records}
                  {/* <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Step One</Text>
                    <Text style={styles.sectionDescription}>
                      Edit <Text style={styles.highlight}>App.js</Text> to change this
                    screen and then come back to see your edits.
                  </Text>
                  </View>
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>See Your Changes</Text>
                    <Text style={styles.sectionDescription}>
                      <ReloadInstructions />
                    </Text>
                  </View>
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Debug</Text>
                    <Text style={styles.sectionDescription}>
                      <DebugInstructions />
                    </Text>
                  </View>
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Learn More</Text>
                    <Text style={styles.sectionDescription}>
                      Read the docs to discover what to do next:
                  </Text>
                  </View>
                  <LearnMoreLinks /> */}
                </View>
              </ScrollView>
            </SafeAreaView>
          </>
        );
      }
    }


};


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

export default Backups;