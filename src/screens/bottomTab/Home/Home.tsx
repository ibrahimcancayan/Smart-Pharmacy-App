import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  Platform
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../../components/Header/Header';
import styles from './styles';
import { setUpNotificationListeners } from '../../../uitls/notification';


interface Medicine {
  id: string;
  ilacAdi: string;
  dozaj: string;
  tip: string;
  baslangicTarihi: string;
  bitisTarihi: string;
}

const width = Dimensions.get('window').width;

const Home: React.FC = ({ }) => {
  const route = useRoute();
  const { uid } = route.params as { uid: string };

  useEffect(() => {
    setUpNotificationListeners(uid);
  }, [uid]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBitisDatePicker, setShowBitisDatePicker] = useState(false);
  const [baslangicTarihi, setBaslangicTarihi] = useState(new Date());
  const [bitisTarihi, setBitisTarihi] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [newMedicine, setNewMedicine] = useState<Medicine>({
    id: '',
    ilacAdi: '',
    dozaj: '',
    tip: '',
    baslangicTarihi: '',
    bitisTarihi: '',
  });

  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .doc(uid)
      .collection(uid)
      .onSnapshot(querySnapshot => {
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
        setMedicines(updatedMedicines);
      });
      

    return () => subscriber();

   
  }, [uid]);

  const closeModal = () => {
    setShowForm(false); 
  };

  const handleAddMedicine = () => {
    const newMedicineData = {
      ...newMedicine,
      baslangicTarihi: baslangicTarihi.toLocaleDateString('tr-TR'), // Tarih formatını ayarla
      bitisTarihi: bitisTarihi.toLocaleDateString('tr-TR'), // Tarih formatını ayarla
    };

    firestore()
      .collection('users')
      .doc(uid)
      .collection(uid)
      .add(newMedicineData)
      .then(() => {
        console.log('İlaç başarıyla eklendi');
        setNewMedicine({
          id: '',
          ilacAdi: '',
          dozaj: '',
          tip: '',
          baslangicTarihi: '',
          bitisTarihi: '',
        });
        setShowForm(false); // Modal'ı kapat
        setShowSuccessIcon(true); // Başarı ikonunu göster

        // 1 saniye sonra ikonu gizle
        setTimeout(() => {
          setShowSuccessIcon(false);
        }, 750);
      })
      .catch(error => {
        console.error('İlaç eklenirken hata oluştu: ', error);
      });
  };

  const handleDeleteMedicine = (id: string) => {
    firestore()
      .collection('users')
      .doc(uid)
      .collection(uid)
      .doc(id)
      .delete()
      .then(() => {
        console.log('İlaç başarıyla silindi');
      })
      .catch(error => {
        console.error('İlaç silinirken hata oluştu: ', error);
      });
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


  const tableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderText}>İlaç Adı</Text>
      <Text style={styles.tableHeaderText}>Başlangıç Tarihi</Text>
      <Text style={styles.tableHeaderText}>Bitiş Tarihi</Text>
      <Text style={styles.tableHeaderText}>Dozaj</Text>
      <Text style={styles.tableHeaderText}>Tip</Text>
      <Text style={styles.tableHeaderText}>Sil</Text>
    </View>
  );


  const RenderOnFlatList = ({ item }) => {

    // const { baslangicTarihi, bitisTarihi } = item;
    // useEffect(() => {
    //   setUpNotificationListeners(baslangicTarihi, bitisTarihi, uid); 
    // }, [uid]);

    return (
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
        <TouchableOpacity onPress={() => handleDeleteMedicine(item.id)}>
          <Icon name="delete" size={30} color="#ff0000" />
        </TouchableOpacity>
      </View>
    );
  };


  return (
    <React.Fragment>
      <Header />
      <View style={styles.container}>
        <FlatList
          data={medicines}
          keyExtractor={item => item.id}
          ListHeaderComponent={tableHeader}
          renderItem={({ item }) => <RenderOnFlatList item={item} />}
        />
        <Modal visible={showForm} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.formTitle}>Yeni İlaç Ekle</Text>
              <TextInput
                style={styles.input}
                value={newMedicine.ilacAdi}
                onChangeText={text => setNewMedicine({ ...newMedicine, ilacAdi: text })}
                placeholder="İlaç Adı"
              />
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
              <TextInput
                style={styles.input}
                value={newMedicine.dozaj}
                onChangeText={text => setNewMedicine({ ...newMedicine, dozaj: text })}
                placeholder="Dozaj"
              />
              <TextInput
                style={styles.input}
                value={newMedicine.tip}
                onChangeText={text => setNewMedicine({ ...newMedicine, tip: text })}
                placeholder="Tip"
              />
              <TouchableOpacity onPress={handleAddMedicine} style={styles.addButtonModal}>
                <Text style={styles.addButtonText}>Ekle</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeModal} style={[styles.addButtonModal, { backgroundColor: '#000' }]}>
                <Text style={styles.addButtonText}>Kapat</Text>
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
    </React.Fragment>
  );
};



export default Home;
