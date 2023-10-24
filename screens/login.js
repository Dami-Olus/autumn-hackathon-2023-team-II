import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const Login = () => {
  const handleLogin = () => {
    alert('Login button pressed');
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput
        placeholder="Email"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default Login;
