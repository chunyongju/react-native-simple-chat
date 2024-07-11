import { initializeApp } from 'firebase/app';
import {
    initializeAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    getReactNativePersistence,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../firebase.json';

const app = initializeApp(config);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });

export const login = async ({ email, password }) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
};

const uploadImage = async uri => {
    if (uri.startsWith('https')) {
        return uri;
    }
  
    const response = await fetch(uri);
    const blob = await response.blob();
  
    const { uid } = auth.currentUser;
    const storage = getStorage(app);
    const storageRef = ref(storage, `/profile/${uid}/photo.png`);
    await uploadBytes(storageRef, blob, {
        contentType: 'image/png',
    });
  
    return await getDownloadURL(storageRef);
};

export const signup = async ({ email, password, name, photoUrl }) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const photoURL = await uploadImage(photoUrl);
    await updateProfile(auth.currentUser, { displayName: name, photoURL });
    return user;
};

export const getCurrentUser = () => {
    const { uid, displayName, email, photoURL } = auth.currentUser;
    return { uid, name: displayName, email, photoUrl: photoURL };
};
  
  export const updateUserInfo = async photo => {
    const photoUrl = await uploadImage(photo);
    await updateProfile(auth.currentUser, { photoUrl });
    return photoUrl;
};

export const logout = async () => {
    await signOut(auth);
    return {};
};

const db = getFirestore(app);

export const createChannel = async ({ title, description }) => {
    const channelCollection = collection(db, 'channels');
    const newChannelRef = doc(channelCollection);
    const id = newChannelRef.id;
    const newChannel = {
        id,
        title,
        description,
        createdAt: Date.now(),
    };
    await setDoc(newChannelRef, newChannel);
    return id;
};

export const createMessage = async ({ channelId, message }) => {
    const docRef = doc(db, `channels/${channelId}/messages`, message._id);
    await setDoc(docRef, { ...message, createdAt: Date.now() });
};