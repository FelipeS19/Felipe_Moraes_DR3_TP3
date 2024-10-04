import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const ImageCard = ({ title = "Título indisponível", description = "Descrição indisponível", valor = "Valor indisponível", imageUrls = [], imageStyle }) => {
  return (
    <Card style={[styles.card, { backgroundColor: 'transparent' }]}>
      <View style={styles.imageContainer}>
        {imageUrls.length > 0 ? (
          <FlatList
            data={imageUrls}
            renderItem={({ item }) => (
              <Card.Cover 
                source={{ uri: item }} 
                style={[styles.image, imageStyle]} 
                resizeMode="cover"
              />
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={true}
            keyExtractor={(item, index) => item ? item.toString() : index.toString()} 
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Paragraph>Sem imagem disponível</Paragraph>
          </View>
        )}
      </View>
      <Card.Content style={styles.Content}>
        <Title numberOfLines={1} ellipsizeMode="tail">{title}</Title>
        <Paragraph numberOfLines={2} ellipsizeMode="tail">{description}</Paragraph>
        <Paragraph numberOfLines={1} ellipsizeMode="tail">{valor}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 40,
    width: 150,
    height: 250,
    elevation: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    
  },
  Content: {
    alignItems: 'center',

  },
  imageContainer: {
    height: 150,
    overflow: 'hidden',
  },
  image: {
    height: 150,
    width: 150,
  },
  placeholderImage: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

export default ImageCard;
