import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Platform,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const icon = {
  Clouds: "cloudy",
  clearsky: "ios-sunny",
  Rain: "rainy",
  overcastclouds: "md-partly-sunny",
  brokenclouds: "cloudy",
  snow: "snow",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [oky, setOky] = useState(true);

  const API_KEY = "be861e161f03811f4e884c3e208cbaaa";

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOky(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const place = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(place[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    console.log(json);
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={"dark-content"}
        translucent={true}
        backgroundColor={"transparent"}
      />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size={"large"} />
          </View>
        ) : (
          days.map((item, index) => {
            return (
              <View key={index} style={styles.day}>
                <Ionicons
                  name={icon[item.weather[0].description.replace(" ", "")]}
                  size={80}
                  color="black"
                />
                <Text style={styles.temp}>{Math.floor(item.temp.day)}°</Text>
                <Text style={styles.description}>{item.weather[0].main}</Text>
                <Text style={styles.textTiny}>
                  {item.weather[0].description}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
      {/* <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Feels Like</Text>
          <Text style={styles.footerText}>humidity</Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            {Math.floor(days[1].feels_like.day)}
          </Text>
          <Text style={styles.footerText}>{days[2].humidity}</Text>
        </View>
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff9f43",
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  city: {
    flex: 1,
    marginHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 44,
    // color: "#fff",
    fontWeight: "300",
  },
  weather: {
    marginLeft: 20,
    alignItems: "center",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
  },
  temp: {
    marginTop: -30,
    fontSize: 145,
    // color: "#fff",
    fontWeight: "600",
  },
  description: {
    marginTop: -35,
    fontSize: 40,
  },
  textTiny: {
    fontSize: 20,
  },
  footer: {
    flex: 1,
    marginHorizontal: 30,
    borderTopWidth: 1,
  },
  footerRow: {
    marginTop: 20,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  footerText: {
    fontSize: 25,
  },
});
