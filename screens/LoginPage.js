import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, StatusBar, AsyncStorage, Keyboard, Image } from 'react-native';
import * as firebase from 'firebase';
import axios from 'axios';

var firebaseConfig = {
    apiKey: "AIzaSyCrOyz47YZuPDhfumXi2GPs8n9v-FkV32Y",
    authDomain: "willow-a6ac7.firebaseapp.com",
    databaseURL: "https://willow-a6ac7.firebaseio.com",
    projectId: "willow-a6ac7",
    storageBucket: "willow-a6ac7.appspot.com",
    messagingSenderId: "92671859968",
    appId: "1:92671859968:web:06ef3b401f28bc9bfc27e5"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

class LoginPage extends Component {
    state = {
        newUser: false,
        email: '',
        password: '',
        name: '',
        error: '',
        loading: false
    }
    componentDidMount() {
        this.fetchUser();
    }
    fetchUser = async () => {
        try {
            let user = await AsyncStorage.getItem('user');
            console.log(user);
            if (user != {} && user != null && user !== '{}') {
                this.props.navigation.navigate('AppScreen');
            } 
        } catch (e) {
            console.log(e);
        }
    }
    handleLogin = () => {
        Keyboard.dismiss();
        this.setState({loading: true});
        if (this.state.email == '' || this.state.password == '') {
            this.setState({error: 'Email and password required.'});
            this.setState({loading: false});
            setTimeout(() => {
                this.setState({error: ''});
            }, 3000);
        } else {
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(doc => {
                this.setState({loading: false});
                this.storeUser(doc.user);
                this.props.navigation.navigate('AppScreen');
            }).catch(e => {
                this.setState({loading: false});
               this.setState({error:e.message}); 
               setTimeout(() => {
                    this.setState({error: ''});
                }, 3000);
            });
        }
    }
    handleSignup = () => {
        Keyboard.dismiss();
        this.setState({loading: true});
        if (this.state.email == '' || this.state.password == '' || this.state.name.length < 1) {
            this.setState({error: 'Name, email and password required.'});
            this.setState({loading: false});
            setTimeout(() => {
                this.setState({error: ''});
            }, 3000);
        } else {
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(doc => {
                axios.post('https://willow-db.herokuapp.com/user', {
                    uid: doc.user.uid,
                    username: this.state.name,
                    email: this.state.email
                }).then(user => {
                    this.setState({loading: false});
                    this.storeUser(doc.user);
                    this.props.navigation.navigate('AppScreen');
                }).catch(e => {
                    this.setState({loading: false});
                });
            }).catch((error) => {
                this.setState({error:error.message});
                setTimeout(() => {
                    this.setState({error: ''});
                }, 3000);
            });
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View>
                    <StatusBar translucent {...this.props} barStyle="light-content" />
                </View>
                <View style={{marginTop: -150}}>
                    {
                        this.state.newUser ?
                        <Text style={{fontSize: 25, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 20}}>Create a new account</Text>
                        :
                        <Text style={{fontSize: 25, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 20}}>Login with existing account</Text>
                    }
                    <View style={styles.form}>
                        {
                            this.state.newUser ?
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                onChangeText={(name) => this.setState({name})}
                                value={this.state.name}
                            />
                            :
                            <Text style={{display: 'none'}}></Text>
                        }
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            onChangeText={(email) => this.setState({email:email.toLowerCase()})}
                            value={this.state.email}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry={true}
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                        />
                        {
                            this.state.newUser ?
                            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={this.handleSignup}>
                                <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>Sign up</Text>
                                {this.state.loading ? <Image style={{width: 20, height: 20}} source={{uri:'https://i.ya-webdesign.com/images/transparent-spinner-7.gif'}}/>:<Text style={{display: 'none'}}></Text>}
                            </TouchableOpacity>
                            :
                            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={this.handleLogin}>
                                <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>Login</Text>
                                {this.state.loading ? <Image style={{width: 20, height: 20}} source={{uri:'https://i.ya-webdesign.com/images/transparent-spinner-7.gif'}}/>:<Text style={{display: 'none'}}></Text>}
                            </TouchableOpacity>
                        }
                        {   this.state.newUser ?
                            <Button
                                title="Already have an account?"
                                onPress={() => {this.setState({newUser:false})}}
                            />
                            :
                            <Button
                                title="new user?"
                                onPress={() => {this.setState({newUser:true})}}
                            />
                        }
                        <Text style={{color: '#E74C3C', textAlign: 'center'}}>{this.state.error}</Text>
                    </View>
                </View>
            </View>
        );
    }
    storeUser(user) {
        AsyncStorage.setItem('user', JSON.stringify(user));
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#154AFA',
        padding: 20
    },
    form: {
        backgroundColor: 'white',
        paddingVertical: 40,
        paddingHorizontal: 30,
        borderRadius: 5
    },
    input: {
        borderColor: 'lightgrey',
        borderWidth: 1,
        marginVertical: 5,
        padding: 10, 
        fontSize: 18,
        color: '#323232'
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#27AE60',
        padding: 10,
        marginVertical: 5,
        borderRadius: 4
    }
});

export default LoginPage;