import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Home, Profile } from '../screens';

const Tab = createBottomTabNavigator();

function BottomTab({  }) {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                showLabel: false,
                tabBarStyle: {
                    borderTopColor: '#ff0000',
                    borderTopWidth: 1,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let iconColor;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                        iconColor = focused ? '#ff0000' : '#000';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'account' : 'account-outline';
                        iconColor = focused ? '#ff0000' : '#000';
                    }

                    return (
                        <View style={{ alignItems: 'center' }}>
                            <Icon name={iconName} size={size} color={iconColor} />
                            {focused && <Icon name="circle" size={8} color="#ff0000" style={{ marginTop: 5 }} />}
                        </View>
                    );
                },
                tabBarLabel: () => null,
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Profile" component={Profile}  />
        </Tab.Navigator>
    );
}

export default BottomTab;

