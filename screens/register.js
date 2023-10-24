import { useState } from 'react';
import { View, Text, TextInput, Button, Switch } from 'react-native';

const Register = () => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const handleRegister = () => {
    alert('Registration successful!');
  };

  const handleToggle = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };

  return (
    <View>
      <Text>Register</Text>
      <TextInput
        placeholder="Name"
      />
      <TextInput
        placeholder="Email"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={isPasswordHidden}
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry={isPasswordHidden}
      />
      <Switch
        value={isPasswordHidden}
        onValueChange={handleToggle}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default Register;
