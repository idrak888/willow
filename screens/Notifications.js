import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';

class Notifications extends Component {
    clear = () => {
        axios.post(`https://willow-db.herokuapp.com/clear-notifications/${this.props.userData.username}`)
        .then(doc => {
            axios.get(`https://willow-db.herokuapp.com/user/${this.props.userData._id}`)
            .then(doc2 => {
                this.props.updateUser(doc2.data);
            });
        }).catch(e => {
            console.log(e);
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
                    <Text style={{fontSize: 15, color: 'grey', alignSelf: 'center'}}>Notifications</Text>
                    <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={this.clear}>
                        <Text style={{color: 'white', fontSize: 15, fontWeight: 'bold', textAlign: 'center'}}>Clear all</Text>
                    </TouchableOpacity>
                </View>
                {this.props.userData && this.props.userData.notifications.length > 0 ? 
                    <FlatList 
                        data={this.props.userData.notifications}
                        keyExtractor={item => item.index}
                        renderItem={data => {
                            return <Text style={styles.notification}>{data.item}</Text>
                        }}
                    />
                    :
                    <View style={{marginTop: 20, alignItems: 'center', backgroundColor: 'white', padding: 30}}>
                        <Image style={{width: 50, height: 50}} source={{uri:'https://cdn0.iconfinder.com/data/icons/actions-1-1/32/Actions_Bell-512.png'}}/>
                        <Text style={{fontSize: 20, fontWeight: 'bold', padding: 20}}>No new notifications</Text>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        padding: 10
    },
    notification: {
        backgroundColor: 'white',
        padding: 15,
        fontSize: 20,
        marginTop: 6,
        fontWeight: 'bold',
        borderRadius: 4
    },
    button: {
        backgroundColor: '#E74C3C',
        padding: 10,
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

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);