import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const createUserDocOnSignup = functions.auth.user().onCreate((user) => {
    const uid = user.uid
    const account = {
        uid: uid,
    }

    return admin.firestore().collection('Users').doc(uid).set(account);
});
