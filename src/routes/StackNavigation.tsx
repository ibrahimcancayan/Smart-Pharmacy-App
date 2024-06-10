import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/start/Login/Login';
import Signup from '../screens/start/Register/Register';
import Home from '../screens/bottomTab/Home/Home';
import BottomTab from './Bottom';

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
    return (
        <Stack.Navigator >
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerTitle: 'Akıllı İlaç',
                    headerStyle: {
                        backgroundColor: 'black', // Sadece Login header'ı için arka plan rengi siyah
                    },
                    headerTintColor: 'red',
                }}
            />
            <Stack.Screen name="Signup" component={Signup}
                options={{
                    headerTitle: 'Akıllı İlaç',
                    headerStyle: {
                        backgroundColor: 'black', // Sadece Login header'ı için arka plan rengi siyah
                    },
                    headerTintColor: 'red',
                }} />
            <Stack.Screen name="BottomTab" component={BottomTab} options={{ headerShown: false }} />

        </Stack.Navigator>
    );
}
