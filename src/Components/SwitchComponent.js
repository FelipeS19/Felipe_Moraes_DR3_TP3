import React from 'react';
import { Switch, Text, View } from 'react-native';

const SwitchComponent = ({ value, onToggle }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text>Toggle me</Text>
      <Switch value={value} onValueChange={onToggle} />
    </View>
  );
};

export default SwitchComponent;
