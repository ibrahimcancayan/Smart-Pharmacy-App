import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import StackNavigation from './src/routes/StackNavigation';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import {setUpNotificationListeners} from './src/uitls/notification';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  switch (type) {
    case EventType.DELIVERED:
      console.log('Bildirim teslim edildi:', detail.notification);
      break;
    case EventType.PRESS:
      console.log('Bildirim tıklandı:', detail.notification);
      break;
    default:
      break;
  }
});

const App = () => {
  let theme = {
    ...DefaultTheme,
    color: {
      ...DefaultTheme.colors,
      background: '#fff',
    },
  };

  useEffect(() => {
    setUpNotificationListeners();
  }, []);

  return (
    <NavigationContainer theme={theme}>
      <StackNavigation />
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
