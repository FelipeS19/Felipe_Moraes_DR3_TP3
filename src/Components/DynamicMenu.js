import React from 'react';
import { Menu as PaperMenu } from 'react-native-paper';
import CustomButton from './CustomButton';


const DynamicMenu = ({ items }) => {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => {
    console.log('Menu aberto');
    setVisible(true);
  };

  const closeMenu = () => {
    console.log('Menu fechado');
    setVisible(false);
  };

  return (
    <PaperMenu
      visible={visible}
      onDismiss={closeMenu}
      anchor={<CustomButton title="Menu" onPress={openMenu} />}
    >
      {items.map((item, index) => (
        <PaperMenu.Item
          key={index}
          onPress={item.onPress}
          title={item.title} 
/>
      ))}
    </PaperMenu>
  );
};

export default DynamicMenu;
