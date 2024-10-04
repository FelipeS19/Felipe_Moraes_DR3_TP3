// ../my-app/Components/Tab.js
import React from 'react';
import { TabView, TabBar } from 'react-native-tab-view';
import { View, Text } from 'react-native';

const Tab = ({ routes }) => {
  const [index, setIndex] = React.useState(0);
  const [routesState, setRoutesState] = React.useState(routes);

  const renderScene = ({ route }) => {
    const { key, component: Component } = route;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Component />
      </View>
    );
  };

  return (
    <TabView
      navigationState={{ index, routes: routesState }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: 300 }}
      renderTabBar={props => (
        <TabBar {...props} style={{ backgroundColor: 'white' }} />
      )}
    />
  );
};

export default Tab;
