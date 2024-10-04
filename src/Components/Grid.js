// Grid.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const Grid = ({ items }) => {
  return (
    <View style={styles.gridContainer}>
      {items.map((item, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <Title>{item}</Title>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    width: '48%',
    margin: '1%',
  },
});

export default Grid;
