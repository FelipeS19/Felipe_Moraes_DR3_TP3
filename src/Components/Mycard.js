// ../my-app/Components/Mycard.js
import React from 'react';
import { Card, Title, Paragraph } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const Mycard = ({ title, content }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{title}</Title>
        <Paragraph>{content}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
});

export default Mycard;
