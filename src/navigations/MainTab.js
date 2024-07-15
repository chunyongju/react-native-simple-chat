import React, { useContext, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Profile, ChannelList } from "../screens";
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from "styled-components/native";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, name }) => {
    const theme = useContext(ThemeContext);
    return (
        <MaterialIcons
            name={name}
            size={26}
            color={focused ? theme.tabActiveColor : theme.tabInactiveColor}
        />
    );
};

const MainTab = ({ navigation, route }) => {
    const theme = useContext(ThemeContext);

    useEffect(() => {
        const title = getFocusedRouteNameFromRoute(route) ?? '대화';
        navigation.setOptions({
        headerTitle: title,
        headerRight: () =>
            title === '대화' && (
                    <MaterialIcons
                        name="add"
                        size={26}
                        style={{ margin: 10 }}
                        onPress={() => navigation.navigate('Channel Creation')}
                    />
                ),

        });
    }, [route]);

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: theme.tabActiveColor,
                tabBarInactiveTintColor: theme.tabInactiveColor,
            }}
        >
            <Tab.Screen 
                name="대화" 
                component={ChannelList} 
                options={{
                    tabBarIcon: ({ focused }) =>
                        TabBarIcon({
                            focused,
                            name: focused ? 'chat-bubble' : 'chat-bubble-outline',
                        }),
                        headerShown: false,
                        headerTitle: '대화',
                }}
            />
            <Tab.Screen 
                name="Profile" 
                component={Profile} 
                options={{
                    tabBarIcon: ({ focused }) =>
                        TabBarIcon({
                            focused,
                            name: focused ? 'person' : 'person-outline',
                        }),
                        headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTab;