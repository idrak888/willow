import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import { TouchableOpacity, ScrollView, TextInput } from 'react-native-gesture-handler';

class NewPost extends Component {
    state = {
        starters: [],
        selectedStarter: '',
        content: '',
        loading: false
    }
    componentDidMount() {
        axios.get('https://willow-db.herokuapp.com/starters')
        .then(doc => {
            this.setState({starters:doc.data});
        }).catch(e => {
            console.log(e);
        });
    }
    selectStarter = selectedStarter => {
        this.setState({selectedStarter});
    }
    post = () => {
        var d = new Date;
        this.setState({loading: true});

        axios.post('https://willow-db.herokuapp.com/post', {
            uid: this.props.userData._id,
            by: this.props.userData.username,
            datePosted: `${d.getUTCDate()}/${d.getUTCMonth()+1}/${d.getFullYear()}`,
            starter: this.state.selectedStarter,
            content: this.state.content
        }).then(doc => {
            this.setState({loading: false});
            var posts = this.props.posts;
            var myPosts = this.props.myPosts;

            myPosts.unshift(doc.data);
            posts.unshift(doc.data);

            this.props.updatePosts(posts);
            this.props.updateMyPosts(myPosts);
            
            this.setState({selectedStarter: '', content: ''});

            alert(`Posted as @${this.props.userData.username}!`);
            this.props.navigation.navigate('Feed');
        }).catch(e => {
            this.setState({loading: false});
            console.log(e);
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={{fontSize: 25, fontWeight: 'bold', marginTop: 40}}>New post</Text>
                {
                    this.state.selectedStarter == '' ?
                    <View style={{paddingVertical: 35, paddingHorizontal: 20, marginTop: 20, width: '100%', backgroundColor: 'white'}}>
                        <Text style={{fontSize: 22, fontWeight: 'bold', color: '#323232'}}>Select a sentence starter</Text>
                        {this.state.starters.length > 1 ? <ScrollView style={{marginVertical: 10, height: 300}}>
                            {this.state.starters.map(starter => {
                                return (
                                    <TouchableOpacity key={starter._id} onPress={() => this.selectStarter(starter.text)} activeOpacity={0.5}>
                                        <Text style={{
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            color: '#154AFA', 
                                            padding: 10, 
                                            borderColor: 'lightgrey', 
                                            borderWidth: 1, 
                                            margin: 5,
                                            borderRadius: 5
                                        }}>{starter.text}...</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>:<Image style={{width: 100, height: 100, alignSelf: 'center'}} source={{uri:'http://cdn.lowgif.com/small/b89db598dfcfb29b-loading-bar-animated-gif-transparent-background-5.gif'}}/>}
                    </View>
                    :
                    <View style={{paddingVertical: 35, paddingHorizontal: 20, marginTop: 20, width: '100%', backgroundColor: 'white'}}>
                        <Text style={{fontSize: 22, fontWeight: 'bold', color: '#323232'}}>Whats on your mind?</Text>
                        {this.state.starters.length > 1 ? 
                            <ScrollView keyboardShouldPersistTaps='handled' style={{marginTop: 20, height: '100%'}}>
                                <Text style={{fontSize: 20, fontWeight: 'bold', color: '#154AFA', paddingRight: 6}}>{this.state.selectedStarter}...</Text>
                                <TextInput 
                                    multiline={true}
                                    numberOfLines={4}
                                    autoFocus={true}
                                    style={styles.input}
                                    placeholder=""
                                    onChangeText={(content) => this.setState({content})}
                                    value={this.state.content}
                                />
                                <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={this.post}>
                                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>Post</Text>
                                    {this.state.loading ? <Image style={{width: 20, height: 20}} source={{uri:'https://i.ya-webdesign.com/images/transparent-spinner-7.gif'}}/>:<Text style={{display: 'none'}}></Text>}
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} style={{...styles.button, marginVertical: 0, backgroundColor: '#D0D0D0'}} onPress={() => {this.setState({selectedStarter:'', content: ''})}}>
                                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>Change starter</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        :<Image style={{width: 100, height: 100, alignSelf: 'center'}} source={{uri:'http://cdn.lowgif.com/small/b89db598dfcfb29b-loading-bar-animated-gif-transparent-background-5.gif'}}/>}
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F0F0F0'
    },
    input: {
        fontSize: 20,
        color: '#323232'
    },
    button: {
        backgroundColor: '#27AE60',
        padding: 10,
        marginVertical: 10,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

function mapStateToProps(state) {
    return { userData: state.appReducer.userData[0], posts: state.appReducer.posts, myPosts: state.appReducer.myPosts }
}

const mapDispatchToProps = dispatch => {
    return {
        updateMyPosts: myPosts => dispatch({ type: 'UPDATE_MY_POSTS', myPosts }),
        updatePosts: posts => dispatch({ type: 'UPDATE_POSTS', posts }),
        updateUser: updatedUser => dispatch({ type: 'UPDATE_USER_DATA', updatedUser })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPost);