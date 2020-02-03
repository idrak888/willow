import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { connect } from 'react-redux'; 

class Post extends React.Component {
    state = {
        liked: false,
        likeConfirmed: false
    }
    componentDidMount() {
        var liked = this.props.likes.includes(this.props.userData.username);
        this.setState({liked, likeConfirmed: liked});
    }
    findWithAttr = (array, attr, value) => {
        for(var i = 0; i < array.length; i += 1) {
            if(array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }
    likePost = () => {
        if (!this.state.likeConfirmed) {
            axios.post(`https://willow-db.herokuapp.com/post/like/${this.props.id}`, {
                username: this.props.userData.username
            }).then(doc => {   
                axios.post(`https://willow-db.herokuapp.com/notification/${this.props.by}`, {
                    notification: `${this.props.userData.username} liked your post!`
                });
                var posts = this.props.posts;
                var likedPostIndex = this.findWithAttr(posts, '_id', this.props.id);
                posts[likedPostIndex].likes.push(this.props.userData.username);

                this.props.updatePosts(posts);
                this.setState({likeConfirmed:true}); 

            }).catch(e => {
                console.log(e);
            });
        }
        if (this.state.liked) {
            this.setState({liked:false});
        } else {
            this.setState({liked:true});
        }
    }
    render () {
        return (
            <View style={{backgroundColor: 'white', paddingVertical: 20, paddingHorizontal: 15, marginTop: 10, borderRadius: 5}}>
                <Text style={{fontSize: 10, color: 'grey', marginBottom: 10}}>@{this.props.by}</Text>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: '#154AFA'}}>{this.props.starter}</Text>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{this.props.content}</Text>
                <Text style={{fontSize: 10, color: 'grey', marginTop: 10}}>{this.props.datePosted}</Text>
                <View style={{flexDirection: 'row-reverse', paddingRight: 10}}>
                    <Text style={{fontSize: 10, color: 'grey', marginBottom: 10, padding: 5}}>{this.props.likes.length}</Text>
                    {this.state.liked ? 
                        <Icon onPress={this.likePost} name="ios-heart" color='#154AFA' size={25}/>
                        :
                        <Icon onPress={this.likePost} name="ios-heart-empty" color='#154AFA' size={25}/>
                    }
                </View>
                
            </View>
        );
    }
};

function mapStateToProps(state) {
    return { userData: state.appReducer.userData[0], posts: state.appReducer.posts }
}

const mapDispatchToProps = dispatch => {
    return {
        updatePosts: posts => dispatch({ type: 'UPDATE_POSTS', posts }),
        updateUser: updatedUser => dispatch({ type: 'UPDATE_USER_DATA', updatedUser })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);