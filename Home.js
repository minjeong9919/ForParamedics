import React, {useState, useEffect} from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native'; 
import { useNavigation } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import moment from 'moment'


const Home = () => {

  const [data, setData] = useState([]);

  const [userName, setUserName] = useState("");
  const [userID, setUserID] = useState("");
  const [userDate, setUserDate] = useState("");
  const [userSymptom, setUserSymptom] = useState("");
  const [symptomLetter, setSymptomLetter] = useState("")
  const [newDate, setNewDate] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const querySnapshot = firestore().collection('GPS')
        .orderBy("Date",'desc').limit(1).onSnapshot((snapshot) => {

          if (!snapshot.empty) {

            const documentSnapshot = snapshot.docs[0];

            const NameValue = documentSnapshot.data().Name;
            const IDValue = documentSnapshot.id;
            const SymptomValue = documentSnapshot.data().symptom;
            const DateValue = documentSnapshot.data().Date;
            const LatitudeValue = documentSnapshot.data().latitude; 
            const LongitudeValue = documentSnapshot.data().longitude;
            const NewDate = moment(DateValue.toDate()).format('YYYY-MM-DD hh:mm:ss')
    
            // console.log(NewDate)
            setNewDate(NewDate)
            setUserName(NameValue)
            setUserSymptom(SymptomValue)
            setData(DateValue)
            setLatitude(LatitudeValue)
            setLongitude(LongitudeValue)
            setUserID(IDValue)

            // console.log(count)
            // console.log(LatitudeValue)
            // console.log(LongitudeValue)
            console.log(SymptomValue)

              if (SymptomValue == 0) {
                setModalVisible(false);
              } else{ setModalVisible(true); }
              // setModalVisible(true)
            }
        });
        

    return querySnapshot;

  }, []);

  return (
    <>
    <Modal
      animationType = "slide"
      transparent = {true}
      visible = {modalVisible}
    >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View style={styles.textBox}>
          <Text style={styles.modalTitleText}>환자 정보</Text> 
        </View>
        <View style={styles.textBox}>
          <Text style={styles.infoText}>환자 증상:  </Text> 
          {userSymptom == "1" ? <Text style={styles.infoText}>심정지</Text> : null}
          {userSymptom == "2" ? <Text style={styles.infoText}>온열질환</Text> : null}
          {userSymptom == "3" ? <Text style={styles.infoText}>골절 및 염좌</Text> : null}
          <Text style={styles.modalText}>{symptomLetter}</Text>
        </View>
        <View style={styles.textBox}>
          <Text style={styles.infoText}>신고 시간:  </Text> 
          <Text style={styles.modalText}>{newDate}</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.buttonClose]}
          onPress={() => {
            userSymptom === 4 ?
            setModalVisible(false)
            : navigation.navigate("Map", {id: userID, symptom: userSymptom, latitude: latitude, longitude: longitude})
            userSymptom === 5 ?
            setModalVisible(false)
            : navigation.navigate("Map", {id: userID, symptom: userSymptom, latitude: latitude, longitude: longitude})
            userSymptom === 6 ?
            setModalVisible(false)
            : navigation.navigate("Map", {id: userID, symptom: userSymptom, latitude: latitude, longitude: longitude})
            userSymptom === 0 ?
            setModalVisible(false)
            : navigation.navigate("Map", {id: userID, symptom: userSymptom, latitude: latitude, longitude: longitude})
          }}>
          <Text style={styles.textStyle}>확인</Text>
        </TouchableOpacity>
      </View>
    </View>    
    </Modal>
    <View style={{backgroundColor: '#2196F3', width:'100%', height:'100%', padding:10}}>
      <Text style = {{ color: "white", fontSize: 30, marginTop: '30%' }}>환자의 호출을{'\n'}기다리고 있습니다 ...</Text>
      <TouchableOpacity onPress={()=> {
        setModalVisible(false)
        navigation.navigate("Map", {id: userID, symptom: userSymptom, latitude: latitude, longitude: longitude})
      }}>
        <Text>지도로 이동하기</Text>
      </TouchableOpacity>
    </View>
    </>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 22,
    backgroundColor: 'grey'
  },
  modalView: {
    width : 300,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 25
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15
  },
  textBox: {
    flexDirection: 'row'
  },
  modalTitleText: {
    marginBottom: 20,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  modalText: {
    marginBottom: 5,
    textAlign: 'center',
    color: 'black',
    fontSize: 15
  },
  infoText: {
    marginBottom: 5,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15
  },
});

export default Home;