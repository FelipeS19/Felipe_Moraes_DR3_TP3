// ../my-app/Components/List.js
import React from 'react';
import { List } from 'react-native-paper';

const List = ({ items }) => {
  return (
    <>
      {items.map((item, index) => (
        <List.Item
          key={index}
          title={item.title}
          description={item.description}
          left={props => <List.Icon {...props} icon="folder" />}
        />
      ))}
    </>
  );
};

export default List;
