import React from 'react';
import { Text, StyleSheet } from 'react-native';

const NotificationCounter = props => <Text style={styles.counter}>{props.count}</Text>

const styles = StyleSheet.create({
    counter: {
        backgroundColor: '#E74C3C', 
        color: 'white', 
        fontWeight: 'bold',
        padding: 5, 
        height: 23, 
        width: 23, 
        textAlign: 'center', 
        borderRadius: 23/2, 
        overflow: 'hidden',
        marginTop: 10,
        fontSize: 10
    }
});

export default NotificationCounter;