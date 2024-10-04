// ../my-app/Components/IconButton.js
import React from 'react';
import { IconButton } from 'react-native-paper';

const IconButton = ({ icon, onPress }) => {
  return (
    <IconButton
      icon={icon}
      onPress={onPress}
    />
  );
};

export default IconButton;
