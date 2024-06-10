import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, TextInput, Alert, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';

const width = Dimensions.get('window').width;

const Home = () => {
    const [showForm, setShowForm] = useState(false);
    const [ilacAdi, setIlacAdi] = useState('');
    const [dozaj, setDozaj] = useState('');
    const [tip, setTip] = useState('');
    const [baslangicTarihi, setBaslangicTarihi] = useState(new Date());
    const [bitisTarihi, setBitisTarihi] = useState(new Date());
    const [ilacBilgileri, setIlacBilgileri] = useState([]);
    const [showSuccessIcon, setShowSuccessIcon] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showBitisDatePicker, setShowBitisDatePicker] = useState(false);

    useEffect(() => {
        readData();
    }, []);

    const readData = async () => {
        const data = await database().ref('/users/').once('value');
        const ilacBilgileriFromFirebase = data.val();
        if (ilacBilgileriFromFirebase) {
            setIlacBilgileri(Object.values(ilacBilgileriFromFirebase));
        }
    };

    const handleDateChange = (event, selected) => {
        const currentDate = selected || baslangicTarihi;
        setShowDatePicker(false);
        setBaslangicTarihi(currentDate);
    };

    const handleBitisDateChange = (event, selected) => {
        const currentDate = selected || bitisTarihi;
        setShowBitisDatePicker(false);
        setBitisTarihi(currentDate);
    };

    const handleIlacEkle = () => {
        if (new Date(bitisTarihi) <= baslangicTarihi) {
            Alert.alert('Bitiş tarihi, başlangıç tarihinden sonra olmalıdır.');
            return;
        }

        const yeniIlac = {
            id: ilacBilgileri.length > 0 ? ilacBilgileri[ilacBilgileri.length - 1].id + 1 : 1,
            ilacAdi,
            baslangicTarihi: baslangicTarihi.toLocaleDateString('tr-TR'),
            bitisTarihi: bitisTarihi.toLocaleDateString('tr-TR'),
            dozaj,
            tip,
        };

        setIlacBilgileri([...ilacBilgileri, yeniIlac]);
        clearForm();
        addDataToFirebase(yeniIlac);
    };

    const addDataToFirebase = async (newData) => {
        await database().ref(`/users/${newData.id}`).set(newData);
        setShowSuccessIcon(true);
        setTimeout(() => {
            setShowSuccessIcon(false);
        }, 2000);
    };

    const deleteData = async (id) => {
        await database().ref(`/users/${id}`).remove();
        readData();
    };

    const clearForm = () => {
        setIlacAdi('');
        setBaslangicTarihi(new Date());
        setBitisTarihi(new Date());
        setDozaj('');
        setTip('');
        setShowForm(false);
    };

    const tableHeader = () => (
        <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>İlaç Adı</Text>
            <Text style={styles.tableHeaderText}>Başlangıç T.</Text>
            <Text style={styles.tableHeaderText}>Bitiş Tarihi</Text>
            <Text style={styles.tableHeaderText}>Dozaj</Text>
            <Text style={styles.tableHeaderText}>Tip</Text>
            <Text style={styles.tableHeaderText}>Sil</Text>
        </View>
    );

    const RenderOnFlatList = ({ item }) => (
        <View style={styles.tableRow}>
            <Text style={styles.tableRowText}>{item.ilacAdi}</Text>
            <View style={styles.divider} />
            <Text style={styles.tableRowText}>{item.baslangicTarihi}</Text>
            <View style={styles.divider} />
            <Text style={styles.tableRowText}>{item.bitisTarihi}</Text>
            <View style={styles.divider} />
            <Text style={styles.tableRowText}>{item.dozaj}</Text>
            <View style={styles.divider} />
            <Text style={styles.tableRowText}>{item.tip}</Text>
            <View style={styles.divider} />
            <TouchableOpacity onPress={() => deleteData(item.id)}>
                <Icon name="delete" size={30} color="#ff0000" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={ilacBilgileri}
                renderItem={({ item }) => <RenderOnFlatList item={item} />}
                ListHeaderComponent={tableHeader}
                keyExtractor={(item, index) => index.toString()}
            />

            <Modal visible={showForm} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.formTitle}>Yeni İlaç Ekle</Text>
                        <TextInput placeholder="İlaç Adı" value={ilacAdi} onChangeText={setIlacAdi} style={styles.input} />
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                            <Text>Başlangıç Tarihi: {baslangicTarihi.toLocaleDateString('tr-TR')}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker value={baslangicTarihi} mode="date" display="spinner" locale="tr-TR" onChange={handleDateChange} />
                        )}
                        <TouchableOpacity onPress={() => setShowBitisDatePicker(true)} style={styles.dateInput}>
                            <Text>Bitiş Tarihi: {bitisTarihi.toLocaleDateString('tr-TR')}</Text>
                        </TouchableOpacity>
                        {showBitisDatePicker && (
                            <DateTimePicker value={bitisTarihi} mode="date" display="spinner" locale="tr-TR" onChange={handleBitisDateChange} />
                        )}
                        <TextInput placeholder="Dozaj" value={dozaj} onChangeText={setDozaj} style={styles.input} />
                        <TextInput placeholder="Tip" value={tip} onChangeText={setTip} style={styles.input} />
                        <TouchableOpacity onPress={handleIlacEkle} style={styles.addButtonModal}>
                            <Text style={styles.addButtonText}>Ekle</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity onPress={() => setShowForm(true)} style={styles.addButton}>
                <Text style={styles.addButtonText}>İlaç Ekle</Text>
            </TouchableOpacity>
            {showSuccessIcon && (
                <View style={styles.successIcon}>
                    <Icon name="check-circle" size={120} color="green" />
                </View>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff0000',
        height: 50,
    },
    tableHeaderText: {
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        color: '#fff',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#888',
        padding: 14,
    },
    tableRowText: {
        flex: 1,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        width: '80%',
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
        height: 40,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
        height: 40,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    addButtonModal: {
        backgroundColor: '#ff0000',
        borderRadius: 8,
        paddingVertical: 12,
        width: width * 0.6,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#ff0000',
        borderRadius: 8,
        paddingVertical: 12,
        width: width * 0.8,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    successIcon: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -60 }, { translateY: -60 }],
        backgroundColor: '#FFF',
        borderRadius: 60,
    },
    divider: {
        width: 1,
        height: '100%',
        backgroundColor: '#888',
        marginHorizontal: 10,
    },
});

export default Home;
