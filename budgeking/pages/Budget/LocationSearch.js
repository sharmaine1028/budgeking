import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colours from "../../styles/colours";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

const latitudeDelta = 0.01;
const longitudeDelta = 0.01;

export class LocationSearch extends React.Component {
  constructor() {
    super();
    this.state = {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      address: "",
      location: null,
      geocode: null,
      errorMessage: "",
    };
  }

  async componentDidMount() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }
    Location.installWebGeolocationPolyfill();
    try {
      let location = await Location.getCurrentPositionAsync({});
      this.setState({
        region: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View style={styles.map}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          minLength={2}
          autoFocus={true}
          fetchDetails={true}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            this.setState({
              address: details.name,
              region: {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: latitudeDelta,
                longitudeDelta: longitudeDelta,
              },
              location: {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              },
            });
          }}
          query={{
            key: "AIzaSyAu-N8OtN5xQwaMYIpkT0IMHF93cu40dAg",
            language: "en",
          }}
          styles={{
            container: {
              flex: 0,
            },
            textInputContainer: {
              flex: 0,
            },
          }}
          currentLocation={true}
          currentLocationLabel="Current location"
          nearbyPlacesAPI="GooglePlacesSearch"
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: "distance",
          }}
          debounce={200}
        />
        <MapView
          style={styles.map}
          region={this.state.region}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            coordinate={{
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude,
            }}
          />
        </MapView>
        <TouchableOpacity style={styles.confirm} onPress={this.confirmLocation}>
          <View style={styles.checkCircle}>
            <MaterialCommunityIcons
              name="check"
              size={30}
              color={colours.white}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  confirmLocation = () => {
    if (this.state.address === "") {
      alert("Enter a location");
    } else {
      this.props.navigation.navigate({
        name: "BudgetPage",
        params: {
          address: this.state.address,
          location: this.state.location,
        },
        merge: true,
      });
    }
  };
}

export default LocationSearch;

const styles = StyleSheet.create({
  checkCircle: {
    backgroundColor: colours.black,
    borderRadius: 999,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  confirm: {
    position: "absolute",
    alignSelf: "flex-end",
    paddingVertical: 40,
    paddingHorizontal: 25,
  },
  map: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
