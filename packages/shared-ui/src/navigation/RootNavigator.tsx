import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ImageSourcePropType } from 'react-native';
import { RootStackParamList } from './types';
import DrawerNavigator from './DrawerNavigator';
import DetailsScreen from '../screens/DetailsScreen';
import PlayerScreen from '../screens/PlayerScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator({ logoSource }: { logoSource?: ImageSourcePropType } = {}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DrawerNavigator">
        {() => <DrawerNavigator logoSource={logoSource} />}
      </Stack.Screen>
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
    </Stack.Navigator>
  );
}
