import firebase from '@firebase/app';
import '@firebase/storage';
import '@firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBk4Z_g5vowQemjfjtfzlZIRbG2JIDiCB0',
  authDomain: 'astrology-a5858.firebaseapp.com',
  projectId: 'astrology-a5858',
  storageBucket: 'astrology-a5858.appspot.com',
  messagingSenderId: '337672317403',
  appId: '1:337672317403:web:08d65d851d5a53ed491ffe',
  measurementId: 'G-G9T0EG3L5C',
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
