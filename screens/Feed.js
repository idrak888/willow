import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import Post from '../components/Post';

class Feed extends Component {
    state = {
        user: {}
    }
    componentDidMount() {
        this.fetchUser();
    }
    fetchUser = async () => {
        try {
            let user = await AsyncStorage.getItem('user');
            if (user == {} || user == null || user == '{}') {
                this.props.navigation.navigate('LoginPage');
            } else {
                axios.get(`https://willow-db.herokuapp.com/user/${JSON.parse(user).uid}`)
                .then(doc => {
                    this.props.updateUser(doc.data);
                    this.props.navigation.setParams({ count:3 });
                    axios.get('https://willow-db.herokuapp.com/posts')
                    .then(doc => {
                        this.props.updatePosts(doc.data.reverse());        
                    }).catch(e => {
                        console.log(e);
                    });
                    
                }).catch(e => {

                });
            }
        } catch (e) {
            console.log(e);
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={{fontSize: 15, color: 'grey', padding: 10}}>Feed</Text>
                { this.props.posts.length > 1 ? <FlatList
                    data={this.props.posts}
                    keyExtractor={item => item._id}
                    showsVerticalScrollIndicator={false}
                    renderItem={data => {
                        return <Post 
                            likes={data.item.likes} 
                            id={data.item._id} 
                            by={data.item.by} 
                            datePosted={data.item.datePosted} 
                            content={data.item.content} 
                            starter={data.item.starter}/>
                    }}
                />
                :
                <View>
                    <View style={{backgroundColor: 'white', paddingVertical: 25, paddingHorizontal: 15, marginTop: 10, borderRadius: 5}}>
                        <Image style={{width: 100, height: 100, alignSelf: 'center'}} source={{uri:'http://cdn.lowgif.com/small/b89db598dfcfb29b-loading-bar-animated-gif-transparent-background-5.gif'}}/>   
                    </View>
                </View>}
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        padding: 10
    }
});

const mapStateToProps = state => {
    return { userData: state.appReducer.userData, posts: state.appReducer.posts }
}

const mapDispatchToProps = dispatch => {
    return {
        // dispatching plain actions
        updatePosts: posts => dispatch({ type: 'UPDATE_POSTS', posts }),
        updateUser: updatedUser => dispatch({ type: 'UPDATE_USER_DATA', updatedUser })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);