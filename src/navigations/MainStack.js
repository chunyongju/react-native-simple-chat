import React, { useContext } from "react";
import { ThemeContext } from "styled-components/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Channel, ChannelCreation } from "../screens";
import MainTab from "./MainTab";

const Stack = createStackNavigator();

const MainStack = () => {
    const theme = useContext(ThemeContext);

    return (
        <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{
                headerTitleAlign: 'center',
                headerTintColor: theme.headerTintColor,
                cardStyle: { backgroundColor: theme.background },
                headerBackTitleVisible: false,
            }}
        >
            <Stack.Screen name="Main" component={MainTab} />
            <Stack.Screen name="Channel Creation" component={ChannelCreation}  options={{ headerTitle: '대화 만들기' }} />
            <Stack.Screen name="Channel" component={Channel} />
        </Stack.Navigator>
    );
};

export default MainStack;