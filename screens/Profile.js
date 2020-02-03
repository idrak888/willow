import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage, Image, TouchableOpacity, FlatList } from 'react-native';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import axios from 'axios';
import Post from '../components/Post';

class Profile extends Component {
    componentDidMount() {
        if (this.props.userData) {
            axios.get(`https://willow-db.herokuapp.com/posts/${this.props.userData.username}`)
            .then(doc => {
                this.props.updateMyPosts(doc.data.reverse());
            }).catch(e => {
                console.log(e);
            });
        }
    }
    logout = () => {
        firebase.auth().signOut().then(doc => {
            //empty screen
            this.setState({loggedIn: false});

            //empty redux
            this.props.updateUser({});
            this.props.updatePosts([]);

            //empty async storage
            this.removeUser({});
            //navigate back to login page
            this.props.navigation.navigate('LoginPage');
        }).catch(e => {
            console.log(e);
        });
    }
    render() {
        return (
            <View style={styles.container}>
                {
                    this.props.userData ? 
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Image 
                            style={{width: 100, height: 100, marginVertical: 20}}
                            source={{uri:'https://t3.ftcdn.net/jpg/00/64/67/80/240_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg'}}
                        />
                        <Text style={{fontSize: 25, fontWeight: 'bold', marginBottom: 18}}>@{this.props.userData.username}</Text>
                        <Text style={{fontSize: 20, marginBottom: 18}}>{this.props.userData.email}</Text>
                        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={this.logout}>
                            <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>Logout</Text>
                        </TouchableOpacity>
                        {this.props.myPosts.length > 0 ? <FlatList 
                            data={this.props.myPosts}
                            style={{backgroundColor: '#F0F0F0', paddingHorizontal: 10, marginTop: 10, flex: 1}}
                            keyExtractor={item => item._id}
                            renderItem={data => {
                                return <Post 
                                    likes={data.item.likes} 
                                    id={data.item._id} 
                                    by={data.item.by} 
                                    datePosted={data.item.datePosted} 
                                    content={data.item.content} 
                                    starter={data.item.starter}/>
                            }}
                        />: <Text>Your posts</Text>}
                    </View>
                    : <Image style={{width: 100, height: 100, alignSelf: 'center'}} source={{uri:'http://cdn.lowgif.com/small/b89db598dfcfb29b-loading-bar-animated-gif-transparent-background-5.gif'}}/>
                }
            </View>
        );
    }
    removeUser(user) {
        AsyncStorage.setItem('user', JSON.stringify(user));
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    button: {
        backgroundColor: '#E74C3C',
        padding: 10,
        marginVertical: 5,
        width: 200,
        borderRadius: 4
    }
});

function mapStateToProps(state) {
    return { userData: state.appReducer.userData[0], myPosts: state.appReducer.myPosts }
}

const mapDispatchToProps = dispatch => {
    return {
        updateMyPosts: myPosts => dispatch({ type: 'UPDATE_MY_POSTS', myPosts }),
        updatePosts: posts => dispatch({ type: 'UPDATE_POSTS', posts }),
        updateUser: updatedUser => dispatch({ type: 'UPDATE_USER_DATA', updatedUser })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);