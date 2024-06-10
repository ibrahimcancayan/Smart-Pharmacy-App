import {StyleSheet, Dimensions} from 'react-native';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    transform: [{translateX: -60}, {translateY: -60}],
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

export default styles;
