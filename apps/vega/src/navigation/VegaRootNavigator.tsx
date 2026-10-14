import { createNativeStackNavigator } from '@amazon-devices/react-navigation__native-stack';
// RootStackParamList comes from ./types which mirrors @multi-tv/shared-ui params
// for Details and Player so that shared-ui screens receive the correct route params.
import { RootStackParamList } from './types';
import VegaDrawerNavigator from './VegaDrawerNavigator';
import { DetailsScreen, PlayerScreen } from '@multi-tv/shared-ui';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function VegaRootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={VegaDrawerNavigator} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
    </Stack.Navigator>
  );
}
