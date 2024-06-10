import { View, Text, TouchableOpacity, Dimensions, Linking } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Header = () => {
    const handleCallEmergency = () => {
        Linking.openURL('tel:112');
    };

    return (
        <View style={{ flexDirection: 'row', backgroundColor: '#000', width: '100%', height: '8%', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#FF0000', left: 5 }}>
                Akıllı İlaç
            </Text>
            <TouchableOpacity onPress={handleCallEmergency} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF0000', width: width * 0.2, height: height * 0.05, borderRadius: 8, marginRight: 5 }}>
               
                <Icon name="alarm-light" size={30} color="#fff" />

            </TouchableOpacity>
        </View>
    );
};

export default Header;
