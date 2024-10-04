// ../my-app/Components/ProgressBar.js
import React from 'react';
import { ProgressBar } from 'react-native-paper';
import { View } from 'react-native';

const ProgressBar = ({ progress }) => {
  return (
    <View style={{ margin: 10 }}>
      <ProgressBar progress={progress} />
    </View>
  );
};

export default ProgressBar;
