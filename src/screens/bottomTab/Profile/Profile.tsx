import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const user = auth().currentUser || {};
    const [userName, setUserName] = useState(user.displayName || 'Angela White');
    const [userEmail, setUserEmail] = useState(user.email || 'whiteangel@gmail.com');
    const [medications, setMedications] = useState<Medicine[]>([]);

    useEffect(() => {
        // İlaçları Firestore'dan al
        firestore()
            .collection('users')
            .doc(user.uid)
            .collection(user.uid)
            .get()
            .then(querySnapshot => {
                const updatedMedicines: Medicine[] = [];
                querySnapshot.forEach(documentSnapshot => {
                    updatedMedicines.push({
                        id: documentSnapshot.id,
                        ilacAdi: documentSnapshot.data().ilacAdi,
                        dozaj: documentSnapshot.data().dozaj,
                        tip: documentSnapshot.data().tip,
                        baslangicTarihi: documentSnapshot.data().baslangicTarihi,
                        bitisTarihi: documentSnapshot.data().bitisTarihi,
                    });
                });
                setMedications(updatedMedicines);
            })
            .catch(error => {
                console.error('İlaçlar alınırken hata oluştu: ', error);
            });

        setUserName(user.displayName || 'John Doe');
        setUserEmail(user.email || 'johndoe@example.com');
    }, [user, medications]); // medications değiştiğinde useEffect hook'u tekrar çalışacak

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem('userToken'); // Remove user token from AsyncStorage
            auth()
                .signOut()
                .then(() => navigation.navigate('Login'))
                .catch(err => console.log(err.message));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileIconContainer}>
                    <Icon name="person" size={80} color="#888" />
                </View>

                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userEmail}>{userEmail}</Text>
                </View>

                <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
                    <Icon name="exit-to-app" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>İletişim ve ilaç bilgisi</Text>

                <View style={styles.medicationContainer}>
                    <Text style={styles.medicationName}>İbrahim Can Çayan</Text>
                    <Text style={styles.medicationName}>Mehmet Bozan</Text>
                    <Text style={styles.medicationName}>Furkan Doğan</Text>
                    <Text style={styles.medicationName}>akilli.ilac.proje@gmail.com</Text>
                </View>

                <Text style={styles.sectionTitle}>İlaç bilgisi</Text>

                <View style={styles.medicationContainer}>
                    <Text style={styles.medicationName}>Toplam İlaç Adedi: {medications.length}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        justifyContent: 'space-between',
    },
    profileIconContainer: {
        borderRadius: 80,
        backgroundColor: '#cecece',
        padding: 10,
    },
    userInfo: {
        marginLeft: 30,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 16,
        color: '#888',
    },
    section: {
        marginBottom: 30,
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    medicationContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    signOutButton: {
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    medicationName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

export default ProfileScreen;
