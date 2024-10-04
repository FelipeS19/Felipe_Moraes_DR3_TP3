import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    height: 190,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#9fd6d7',
  },
  dados: {
    position: 'absolute',
    top: 30,
    right: 0,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  Avatar: {
    width: 60,
    height: 60,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginTop: 100,
    height: 2,
    backgroundColor: 'white',
    width: '100%',
  },
  settingsContainer: {
    marginTop: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsText: {
    color: '#000',
    fontSize: 16,
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#9fd6d7',
    marginBottom: 15,
    paddingHorizontal: 0,
    color: 'black',
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  saveButton: {
    backgroundColor: '#9fd6d7',
    padding: 10,
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#9fd6d7',
    fontSize: 16,
  },
  changePhotoText: {
    fontSize: 16,
    color: '#9fd6d7',
    marginVertical: 10,
  },
});

export default styles;
