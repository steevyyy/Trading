
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function AuthScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Connecta</Text>
      <Button title="Sign In" onPress={() => navigation.navigate('Main')} />
      <Button title="Sign Up" onPress={() => navigation.navigate('Main')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
