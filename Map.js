import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE, animateMarkerToCoordinate } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';

import { useNavigation } from "@react-navigation/native";
import { withNavigation } from 'react-navigation';


class MapScreen extends React.Component {
  constructor(props) {
    super(props);

    const userID = this.props.route.params.id;
    const PALatitude = this.props.route.params.latitude;
    const PALongitude = this.props.route.params.longitude;
    const PASymptom = this.props.route.params.symptom;

    this.state = {
      latitude: 0,
      longitude: 0,
      LATITUDE_DELTA: 0.003,
      LONGITUDE_DELTA: 0.003,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      coordinate: new AnimatedRegion({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0
      }),
      PAid: userID.toString(),
      PAlatitude: parseFloat(PALatitude),
      PAlongitude: parseFloat(PALongitude),
      PAsymptom: PASymptom.toString()
    };
  }

  componentDidMount() {

    this.watchID = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const newCoordinate = { latitude, longitude };

        if (this.marker) {
          this.marker.animateMarkerToCoordinate(newCoordinate, 500);
        }

        this.setState({
          latitude,
          longitude
        });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 2 }
    );
  }

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
  }zz

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: this.state.LATITUDE_DELTA,
    longitudeDelta: this.state.LONGITUDE_DELTA
  });

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  render() {
    const { latitude, longitude } = this.state;
    const { PAid, PAsymptom, PAlatitude, PAlongitude } = this.state;

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showUserLocation
          followUserLocation
          loadingEnabled
          region={this.getMapRegion()}
        >
          <Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}
          />
          <Marker
            coordinate={{
              latitude: PAlatitude,
              longitude: PAlongitude
            }}
          >
            <Image source={require('./images/PatientIcon.png')} style={{ width: 30, height: 30 }} />
          </Marker>
        </MapView>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.props.navigation.navigate('Home');
            if (PAsymptom === '1') {
              firestore().collection('GPS').doc(PAid).update({ symptom: '4' });
              setTimeout(() => {
                firestore().collection('GPS').doc(PAid).update({ symptom: '0' });
              }, 10000);
            } else if (PAsymptom === '2') {
              firestore().collection('GPS').doc(PAid).update({ symptom: '5' });
              setTimeout(() => {
                firestore().collection('GPS').doc(PAid).update({ symptom: '0' });
              }, 10000);
            } else if (PAsymptom === '3') {
              firestore().collection('GPS').doc(PAid).update({ symptom: '6' });
              setTimeout(() => {
                firestore().collection('GPS').doc(PAid).update({ symptom: '0' });
              }, 10000);
            } else {null}
            firestore().collection('Music').doc('Music').update({ state: 'end' });
            // console.log("dd")
            // setTimeout(()=>{
            //   console.log("dd2")
            // },5000)
          }}
        >
          <Text style={styles.textStyle}>상황종료</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'right'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  button: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#2196F3',
    margin: 10
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20
  }
});

export default withNavigation(MapScreen);
