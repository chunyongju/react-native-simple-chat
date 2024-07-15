import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { Alert } from 'react-native';
import { GiftedChat, Send, InputToolbar, Bubble } from 'react-native-gifted-chat';
import { MaterialIcons } from '@expo/vector-icons';
import { createMessage, getCurrentUser, app } from '../utils/firebase';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  doc,
  orderBy,
} from 'firebase/firestore';

const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
`;

const SendButton = props => {
    const theme = useContext(ThemeContext);
  
    return (
        <Send
            {...props}
            disabled={!props.text}
            containerStyle={{
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 4,
            }}
        >
            <MaterialIcons
                name="send"
                size={24}
                color={
                    props.text ? theme.sendButtonActivate : theme.sendButtonInactivate
                }
            />
        </Send>
    );
};

const renderInputToolbar = props => {
    return (
        <InputToolbar
            {...props}
            containerStyle={{
                borderTopWidth: 2,
                margin: 5,
                borderRadius: 20,
                borderColor: '#eee',
                backgroundColor: '#eee'
            }}
        />
    );
};

const renderBubble = props => {
    return (
        <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#0084ff'
                },
                left: {
                    backgroundColor: '#FFFA99'
                }
                }}
                textStyle={{
                right: {
                    color: '#fff'
                },
                left: {
                    color: '#000'
                }
            }}
        />
    );
};

const Channel = ({ navigation, route }) => {
    const theme = useContext(ThemeContext);
    const { uid, name, photoUrl } = getCurrentUser();
    const [messages, setMessages] = useState([]);

    const db = getFirestore(app);
    useEffect(() => {
        const docRef = doc(db, 'channels', route.params.id);
        const collectionQuery = query(
            collection(db, `${docRef.path}/messages`),
            orderBy('createdAt', 'desc')
        );
        const unsubscribe = onSnapshot(collectionQuery, snapshot => {
            const list = [];
            snapshot.forEach(doc => {
                list.push(doc.data());
            });
            setMessages(list);
        });
        return () => unsubscribe();
    }, []);
  
    useLayoutEffect(() => {
        navigation.setOptions({ headerTitle: route.params.title || 'Channel' });
    }, []);

    const _handleMessageSend = async messageList => {
        const newMessage = messageList[0];
        try {
            await createMessage({ channelId: route.params.id, message: newMessage });
        } catch (e) {
            Alert.alert('Send Message Error', e.message);
        }
    };

    return (
        <Container>
            <GiftedChat
                listViewProps={{
                    style: { backgroundColor: theme.background },
                }}
                placeholder="메시지..."
                messages={messages}
                user={{ _id: uid, name, avatar: photoUrl }}
                onSend={_handleMessageSend}
                alwaysShowSend={true}
                textInputProps={{
                    autoCapitalize: 'none',
                    autoCorrect: false,
                    textContentType: 'none', // iOS only
                    underlineColorAndroid: 'transparent', // Android only
                }}
                isTyping
                multiline={true}
                renderUsernameOnMessage={true}
                scrollToBottom={true}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderSend={props => <SendButton {...props} />}
            />
        </Container>
    );
};

export default Channel;