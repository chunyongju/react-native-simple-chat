import React, { useState, useEffect } from "react";
import { StatusBar, Image } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";
import Navigation from "./navigations";
import { images } from "./utils/images";
import { ProgressProvider, UserProvider } from "./contexts";

const cacheImages = images => {
    return images.map(image => {
        if (typeof image === 'string') {
            return Image.prefetch(image);
        } else {
            return Asset.fromModule(image).downloadAsync();
        }
    });
};

const cacheFonts = fonts => {
    return fonts.map(font => Font.loadAsync(font));
};

const App = () => {
    const [isReady, setIsReady] = useState(false);
 
    useEffect(() => {
        async function prepare() {
            try {
                await SplashScreen.preventAutoHideAsync();
                await _loadAssets(); // Load your tasks
            } catch (e) {
                console.warn(e);
            } finally {
                setIsReady(true);
                await SplashScreen.hideAsync();
            }
        }

        prepare();
    }, []);

    const _loadAssets = async () => {
        const imageAssets = cacheImages([
            require('../assets/splash.png'),
            ...Object.values(images),
        ]);
        const fontAssets = cacheFonts([]);

        await Promise.all([...imageAssets, ...fontAssets]);
    };

    if (!isReady) {
        return null;
    }

    return (
        <ThemeProvider theme={theme}>
            <UserProvider>
                <ProgressProvider>
                    <StatusBar barStyle="dark-content" />
                    <Navigation />
                </ProgressProvider>
            </UserProvider>
        </ThemeProvider>
    );
};

export default App;