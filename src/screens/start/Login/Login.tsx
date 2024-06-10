import React, { useState, useEffect } from 'react';
import { Alert, SafeAreaView, Text, TouchableOpacity, View, StyleSheet, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            if (userToken) {
                // Navigate to Home or any other screen if userToken exists
                navigation.navigate("BottomTab", { screen: 'Home', params: { uid: userToken } });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const loginSubmit = () => {
        if (!email || !password) {
            Alert.alert("Lütfen tüm alanları doldurunuz");
            return;
        }
        auth().signInWithEmailAndPassword(email, password)
            .then((res) => {
                console.log(res);
                setEmail('');
                setPassword('');
                AsyncStorage.setItem('userToken', res.user.uid); // Save user token to AsyncStorage
                navigation.navigate("BottomTab", { screen: 'Home', params: { uid: res.user.uid } });
            })
            .catch((error) => console.log(error.message));
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.container}>
                <Text style={styles.heading}>Giriş Yap</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email Giriniz"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Şifrenizi Giriniz"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry
                />
                <TouchableOpacity onPress={loginSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Giriş</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={styles.signupLink}>
                    <Text style={[styles.text, { color: 'black' }]}>Hesabın Yok mu </Text>
                    <Text style={[styles.text, { color: '#0096FF' }]}>Kayıt Ol</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        color: '#000',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    button: {
        padding: 16,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: 'red',
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
    },
    signupLink: {
        marginVertical: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Login;
