/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Alert, SafeAreaView, Text, TouchableOpacity, View, StyleSheet, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Signup: React.FC<Props> = ({ navigation: { navigate } }) => {
    const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const updateInputval = (val, key) => {
        const value = { ...values };
        value[key] = val;
        setValues({ ...value })
    };

    const singupSubmit = () => {
        console.log("values", values)
        if (!values.email || !values.password || !values.confirmPassword || !values.name) {
            Alert.alert("Lütfen tüm alanları doldurunuz.");
            return false;
        }
        if (values.password !== values.confirmPassword) {
            Alert.alert("Passwords do not match.");
            return false;
        }

        auth().createUserWithEmailAndPassword(values.email, values.password).then((res: any) => {
            res.user.updateProfile({
                displayName: values.name,
            })
            console.log("user Created Successfully!");
            setValues({ name: '', email: '', password: '', confirmPassword: '' });
            navigate("Login");
        }).catch((error: any) => console.log(error.message))
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ alignItems: 'center' }}>

                <Text
                    style={{
                        fontSize: 30,
                        color: '#000',
                        marginVertical: 10,
                        fontWeight: 'bold',
                    }}>
                    Üye Ol
                </Text>
            </View>
            <View style={styles.redContainer}>


                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ad Soyad Giriniz"
                        value={values.name}
                        onChangeText={(text) => updateInputval(text, 'name')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email Giriniz"
                        value={values.email}
                        onChangeText={(text) => updateInputval(text, 'email')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Şifre Giriniz"
                        secureTextEntry={true}
                        value={values.password}
                        onChangeText={(text) => updateInputval(text, 'password')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Şifre Onayla"
                        secureTextEntry={true}
                        value={values.confirmPassword}
                        onChangeText={(text) => updateInputval(text, 'confirmPassword')}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => singupSubmit()}
                    style={styles.button}>
                    <Text style={styles.buttonText}>
                        Üye Ol
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        navigate('Login');
                    }}
                    style={styles.signupLink}>
                    <Text style={[styles.text, { color: 'black' }]}>Hesabın Varmı </Text>
                    <Text style={[styles.text, { color: '#0096FF' }]}>Giriş Yap</Text>
                </TouchableOpacity>


            </View>
        </SafeAreaView>
    );
};

export default Signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    redContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'red',
    },
    inputContainer: {
        marginVertical: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        padding: 16,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: '#ff0000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
    },
    signupLink: {
        padding: 20,
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
