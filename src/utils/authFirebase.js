import firebase from './firebase';
import '@firebase/auth';

const auth = firebase.auth();

const logInWithEmailAndPassword = async (email, password) => {
  const credentials = await auth.signInWithEmailAndPassword(email, password);
  const token = await credentials.user.getIdToken();
  if (token) {
    return token;
  }
  return '';
};
export { logInWithEmailAndPassword };
