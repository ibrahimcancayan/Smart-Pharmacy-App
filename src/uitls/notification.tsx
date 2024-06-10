import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';

interface MedicineData {
    baslangicTarihi: string;
    bitisTarihi: string;
}

export const setUpNotificationListeners = async (uid: string): Promise<void> => {
    try {
        // Android için bildirim izni iste
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Permission denied');
            }
        }

        // Firebase Cloud Messaging token al
        const token = await messaging().getToken();
        console.log('Token:', token);

        const saveUserTokenToDatabase = async (uid: string, token: string) => {
            try {
                // Tokenı Firebase Realtime Database'de kontrol et
                const snapshot = await database().ref(`users/${uid}/token`).once('value');
                const existingToken = snapshot.val();

                if (!existingToken || existingToken !== token) {
                    // Tokenı Firebase Realtime Database'e kaydet
                    await database().ref(`users/${uid}/token`).set(token);
                    console.log('Token başarıyla kaydedildi');
                } else {
                    console.log('Token zaten kayıtlı veya aynı token');
                }
            } catch (error) {
                console.error('Token kaydedilirken hata oluştu:', error);
            }
        };

        // Kullanıcının UID'si varsa tokenı al ve kaydet
        if (uid && token) {
            saveUserTokenToDatabase(uid, token);
        }

        // Bildirim dinleyicilerini kur
        messaging().onMessage(onMessageReceived);

        // 4 saat aralıklarla bildirim göndermek için zamanlayıcı oluştur
        setInterval(() => {
            sendMedicineDatesNotification(uid);
        }, 4 * 60 * 60 * 1000); // 4 saat (4 * 60 * 60 * 1000 milisaniye)
    } catch (err) {
        console.error('Error setting up notification listeners:', err);
    }
};

const onMessageReceived = async (message: any) => {
    console.log('Message received:', message);
};

const sendMedicineDatesNotification = async (uid: string) => {
    try {
        // Firestore'dan ilaç verilerini çek
        const medicineRef = firestore().collection('users').doc(uid).collection(uid);

        const snapshot = await medicineRef.get();
        const medicineList: MedicineData[] = [];

        snapshot.forEach(doc => {
            const data = doc.data() as MedicineData;
            medicineList.push(data);
        });

        // İlaç verilerini kullanarak bildirim oluştur
        const channelId = await notifee.createChannel({
            id: 'important',
            name: 'Important Notifications',
            sound: 'ringtone',
            vibration: true,
            vibrationPattern: [300, 500],
            importance: AndroidImportance.HIGH,
        });
        const now = new Date();
        const todayDateString = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });

        medicineList.forEach(medicine => {
            const { baslangicTarihi, bitisTarihi } = medicine;
            console.log('Başlangıç Tarihi:', baslangicTarihi);
            console.log('Bitiş Tarihi:', bitisTarihi);

            if (isToday(baslangicTarihi) || isToday(bitisTarihi)) {
                notifee.displayNotification({
                    title: 'İlaç Tarihleri',
                    body: `Başlangıç Tarihi: ${baslangicTarihi}, Bitiş Tarihi: ${bitisTarihi}`,
                    android: {
                        channelId,
                        importance: AndroidImportance.HIGH,
                        sound: 'customsound',
                        pressAction: {
                            id: 'default',
                        },
                    },
                });
            }
        });
    } catch (error) {
        console.error('Error sending medicine dates notification:', error);
    }
};


// Yardımcı fonksiyon: Verilen tarihin bugün olup olmadığını kontrol et
const isToday = (dateString: string): boolean => {
    const now = new Date();
    const todayDateString = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return dateString === todayDateString;
};
