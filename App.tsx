import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
//import { Ionicons } from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const HistoryScreen = ({ history, clearHistory }) => (
  <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.screenTitle}>History Screen</Text>
      {history.map((item, index) => (
        <View key={index} style={styles.historyItem}>
          <Text style={styles.historyItemText}>Item: {item.tag}</Text>
          <Text style={styles.historyItemText}>Shipped To: {item.shippedTo}</Text>
          <Text style={styles.historyItemText}>Status: {item.successful ? 'Successful' : 'Unsuccessful'}</Text>
        </View>
      ))}
    </ScrollView>
    <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
      <Text style={styles.buttonText}>Clear History</Text>
    </TouchableOpacity>
  </View>
);

const MapScreen = () => (
  <View style={styles.container}>
    <Text>Map Screen</Text>
  </View>
);

const DispatchScreen = () => (
  <View style={styles.container}>
    <Text>Dispatch Screen</Text>
    {/* Add UI components for dispatching items */}
  </View>
);

const HomeScreen = ({ setHistory, isSeller }) => {
  const [shipmentStatus, setShipmentStatus] = useState('');
  const [productInfo, setProductInfo] = useState(null);
  const [buttonVisibility, setButtonVisibility] = useState([]);
  const [dispatchHash, setDispatchHash] = useState('');
  const navigation = useNavigation();
  const [tagCounter, setTagCounter] = useState(1);

  const handleScanRFIDTag = () => {
    const scannedRFIDData = {
      tag: `Tag${tagCounter}`,
      shippedTo: `Destination ${tagCounter}`,
      successful: tagCounter % 2 === 0,
    };

    setProductInfo(scannedRFIDData);
    setShipmentStatus('In Transit');
    setTagCounter(prevCounter => prevCounter + 1);
    setButtonVisibility(prevVisibility => [...prevVisibility, true]);
  };

  const handleMarkSuccess = (index) => {
    if (productInfo && buttonVisibility[index]) {
      const updatedProductInfo = { ...productInfo, successful: true };
      setProductInfo(updatedProductInfo);
      setShipmentStatus('Success');
      updateButtonVisibility(index);
      updateHistory(updatedProductInfo);
    }
  };

  const handleMarkDamaged = (index) => {
    if (productInfo && buttonVisibility[index]) {
      const updatedProductInfo = { ...productInfo, successful: false };
      setProductInfo(updatedProductInfo);
      setShipmentStatus('Damaged');
      updateButtonVisibility(index);
      updateHistory(updatedProductInfo);
    }
  };

  const handleDispatch = () => {
    // Generate a dummy hash for demonstration
    const hash = "12345ABC";
    setDispatchHash(hash);
  };

  const updateButtonVisibility = (index) => {
    setButtonVisibility(prevVisibility => {
      const updatedVisibility = [...prevVisibility];
      updatedVisibility[index] = false;
      return updatedVisibility;
    });
  };

  const updateHistory = (item) => {
    setHistory(prevHistory => [...prevHistory, item]);
  };

  useEffect(() => {
    setTimeout(() => {
      setShipmentStatus('In Transit');
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>RFID Tag Scanner</Text>
        {!isSeller && (
          <TouchableOpacity style={styles.scanButton} onPress={handleScanRFIDTag}>
            <Text style={styles.buttonText}>Scan RFID Tag</Text>
          </TouchableOpacity>
        )}
        {isSeller && (
          <TouchableOpacity style={styles.dispatchButton} onPress={handleDispatch}>
            <Text style={styles.buttonText}>Dispatch Item</Text>
          </TouchableOpacity>
        )}
        {shipmentStatus ? (
          <View style={styles.scannedDataContainer}>
            <Text style={styles.scannedDataText}>Shipment Status: {shipmentStatus}</Text>
            {productInfo && (
              <View>
                <Text style={styles.productInfoTitle}>Product Information:</Text>
                <Text style={styles.productInfoText}>Tag: {productInfo.tag}</Text>
                <Text style={styles.productInfoText}>Shipped To: {productInfo.shippedTo}</Text>
                {buttonVisibility.map((visible, index) => (
                  visible && (
                    <View key={index} style={{ flexDirection: 'row', marginTop: 10 }}>
                      <TouchableOpacity style={[styles.markButton, { backgroundColor: '#32CD32' }]} onPress={() => handleMarkSuccess(index)}>
                        <Text style={styles.buttonText}>Delivered</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.markButton, styles.markButtonDamaged, { backgroundColor: '#FF6347' }]} onPress={() => handleMarkDamaged(index)}>
                        <Text style={styles.buttonText}>Damaged</Text>
                      </TouchableOpacity>
                    </View>
                  )
                ))}
              </View>
            )}
          </View>
        ) : null}
        {dispatchHash !== '' && (
          <View style={styles.hashContainer}>
            <Text style={styles.hashText}>Dispatch Hash: {dispatchHash}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const SwitchAccountScreen = ({ setIsSeller, isSeller }) => (
  <View style={styles.container}>
    <Text>Switch Account Screen</Text>
    <TouchableOpacity
      style={styles.switchButton}
      onPress={() => setIsSeller(!isSeller)} // Toggle the role
    >
      <Text style={styles.buttonText}>
        Switch to {isSeller ? 'Buyer' : 'Seller'}
      </Text>
    </TouchableOpacity>
  </View>
);

const tabBarIcon = ({ focused, color, size, route }) => {
  if (!route) {
    return null;
  }

  let iconName;

  if (route.name === 'Home') {
    iconName = focused ? 'home' : 'home-outline';
  } else if (route.name === 'History') {
    iconName = focused ? 'time' : 'time-outline';
  } else if (route.name === 'Map') {
    iconName = focused ? 'map' : 'map-outline';
  } else if (route.name === 'SwitchAccount') {
    iconName = focused ? 'person-circle' : 'person-circle-outline';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

const App = () => {
  const [history, setHistory] = useState([]);
  const [isSeller, setIsSeller] = useState(false);

  const clearHistory = () => {
    setHistory([]);
  };

    return (
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Tab.Navigator
          screenOptions={{
            tabBarIcon: tabBarIcon,
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: 'white',
              borderTopWidth: 1,
              borderTopColor: 'lightgray',
            },
          }}
        >
          <Tab.Screen
            name="Home"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="home-outline" size={size} color={color} />
              ),
            }}
          >
            {() => <HomeScreen setHistory={setHistory} isSeller={isSeller} />}
          </Tab.Screen>
          <Tab.Screen
            name="History"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="time-outline" size={size} color={color} />
              ),
            }}
          >
            {() => <HistoryScreen history={history} clearHistory={clearHistory} />}
          </Tab.Screen>
          <Tab.Screen
            name="Map"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="map-outline" size={size} color={color} />
              ),
            }}
          >
            {() => <MapScreen />}
          </Tab.Screen>
          <Tab.Screen
            name="SwitchAccount"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="person-circle-outline" size={size} color={color} />
              ),
            }}
          >
            {() => (
              <SwitchAccountScreen setIsSeller={setIsSeller} isSeller={isSeller} />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  dispatchButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  clearButton: {
    backgroundColor: '#FF6347',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
    alignSelf: 'center',
  },
  switchButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scannedDataContainer: {
    marginTop: 20,
  },
  scannedDataText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  productInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productInfoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  historyItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#EEE',
    borderRadius: 10,
  },
  historyItemText: {
    fontSize: 16,
  },
  markButton: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markButtonDamaged: {
    backgroundColor: '#FF6347',
  },
  hashContainer: {
    marginTop: 20,
    backgroundColor: '#EEE',
    padding: 10,
    borderRadius: 10,
  },
  hashText: {
    fontSize: 16,
  },
});

export default App;
