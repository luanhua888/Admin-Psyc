import firebase from './firebase';
import { storage } from './firebase';

export const uploadFile = async (file, folder) => {
  try {
    let imgLink;
    const storageRef = storage.ref();
    const fileRef = storageRef.child(`${folder}/${Date.now().toString() + file.name}`);
    let metaData = {
      contentType: 'image/jpeg',
    };

    let uploadTask = storage.ref(`${folder}/${file.name}`).put(file, metaData);
    const uploadTaskSnapshot = await fileRef.put(file, metaData);
    const dowloadUrl = await uploadTaskSnapshot.ref.getDownloadURL();
    console.log('downloadUrl', dowloadUrl);
    imgLink = dowloadUrl;
    return imgLink;
  } catch (error) {
    console.log(error);
  }
};
