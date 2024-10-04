// ../my-app/Components/Snackbar.js
import React, { useState } from 'react';
import { Snackbar } from 'react-native-paper';

const Snackbar = () => {
  const [visible, setVisible] = useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  return (
    <>
      <Snackbar
        visible={visible}
        onDismiss={onToggleSnackBar}
        action={{
          label: 'Fechar',
          onPress: () => {

          },
        }}>
        Esta é uma mensagem de Snackbar!
      </Snackbar>
    </>
  );
};

export default Snackbar;
