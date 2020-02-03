import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Logo from '../assets/willow-white.png';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import LoginPage from '../screens/LoginPage';
import Feed from '../screens/Feed';
import NewPost from '../screens/NewPost';
import Profile from '../screens/Profile';
import Notifications from '../screens/Notifications';

import NotificationCounter from '../components/NotificationCounter';

const TabNavigator = createBottomTabNavigator({
    Feed: {
        screen: Feed,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => <Icon name="ios-home" size={30} color={tintColor == '#154AFA' ? '#154AFA':'grey'}/>
        }
    },
    NewPost: {
        screen: NewPost,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => <Icon name="ios-add" size={40} color={tintColor == '#154AFA' ? '#154AFA':'grey'}/>
        }
    },
    Notifications: {
        screen: Notifications,
        navigationOptions: ({ navigation }) => ({
            tabBarButtonComponent: ({ tintColor }) => {
                return (
                    <TouchableOpacity style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}} activeOpacity={0.7} onPress={() => navigation.navigate('Notifications')}>
                        <Icon style={{alignSelf: 'center'}} name="ios-notifications" size={30} color={tintColor == '#154AFA' ? '#154AFA':'grey'}/>
                        <NotificationCounter count={navigation.getParam('count')}/>
                    </TouchableOpacity>
                )
            }
        })
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => <Icon name="ios-person" size={30} color={tintColor == '#154AFA' ? '#154AFA':'grey'}/>
        }
    }
}, {
    tabBarOptions: {
        activeTintColor: '#154AFA',
        showIcon: true,
        showLabel: false,
        labelStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            height: 40
        },
        style: {
            height: 60
        }
    }
});

const Navigator = createStackNavigator({
    LoginPage: {
        screen: LoginPage,
        navigationOptions: {
            headerRight: () => null
        }
    },
    AppScreen: {
        screen: TabNavigator,
        navigationOptions: {
            gestureEnabled: false
        }
    }
}, {
    defaultNavigationOptions: {
        headerTitle: () => <Image source={Logo} style={{width: 120, height: 30, marginTop: 15}}/>,
        headerTintColor: 'white',
        headerLeft: () => null,
        headerStyle: {
            height: 120,
            backgroundColor: '#154AFA',
            shadowColor: 'transparent',
            elevation: 0
        }
    }
});

export default createAppContainer(Navigator);