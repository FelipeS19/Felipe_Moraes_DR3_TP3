// ../my-app/Components/RadioButton.js
import React, { useState } from 'react';
import { RadioButton } from 'react-native-paper';
import { View } from 'react-native';

const RadioButton = () => {
  const [value, setValue] = useState('first');

  return (
    <View>
      <RadioButton
        value="first"
        status={value === 'first' ? 'checked' : 'unchecked'}
        onPress={() => setValue('first')}
      />
      <RadioButton
        value="second"
        status={value === 'second' ? 'checked' : 'unchecked'}
        onPress={() => setValue('second')}
      />
    </View>
  );
};

export default RadioButton;
