import React from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

const Loading = () => {
    const animation = new Animated.Value(1);
    const startAnimation = () => {
        animation.setValue(1);
        Animated.timing(animation, {
            toValue: 1.5, 
            duration: 800, 
            useNativeDriver: true,
            friction: 1,
            tension: 40,
        }).start(() => startAnimation()); 
    };

    React.useEffect(() => {
        startAnimation();
    }, []);

    const animatedStyle = {
        transform: [{ scale: animation }],
    };

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../../assets/logo.png')} 
                style={[styles.image, animatedStyle]}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9fd6d7', 
    },
    image: {
        width: 100, 
        height: 100,
    },
});

export default Loading;
