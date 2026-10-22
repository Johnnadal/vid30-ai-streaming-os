import React, { useEffect, StrictMode } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { ImageSourcePropType, Platform } from 'react-native';
import { MenuProvider } from '../components/MenuContext';
import { GoBackConfiguration } from '../app/remote-control/GoBackConfiguration';
import RootNavigator from './RootNavigator';

export interface AppNavigatorProps {
  fontsLoaded?: boolean;
  onReady?: () => void;
  logoSource?: ImageSourcePropType;
}

export default function AppNavigator({ fontsLoaded = true, onReady, logoSource }: AppNavigatorProps) {
  useEffect(() => {
    // Import remote control config for TV platforms
    if (Platform.isTV) {
      try {
        require('../app/configureRemoteControl');
      } catch (error) {
        console.warn('Remote control configuration not available:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded && onReady) {
      onReady();
    }
  }, [fontsLoaded, onReady]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <StrictMode>
      <NavigationContainer theme={DarkTheme}>
        <MenuProvider>
          <GoBackConfiguration />
          <RootNavigator logoSource={logoSource} />
        </MenuProvider>
      </NavigationContainer>
    </StrictMode>
  );
}
