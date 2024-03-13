import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('LoginScreen');
    }, 3000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../myAssets/chama.png')}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default SplashScreen;
