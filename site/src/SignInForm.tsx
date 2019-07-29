import * as React from "react";
import * as firebase from "firebase/app";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import "firebase/auth";

const uiConfig = {
  // autoUpgradeAnonymousUsers: true,
  callbacks: {
    signInSuccessWithAuthResult: function(authResult: firebase.auth.UserCredential, redirectUrl: string) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return false;
    },
    // signInFailure callback must be provided to handle merge conflicts which
    // occur when an existing credential is linked to an anonymous user.
    // signInFailure: function(error: firebaseui.auth.AuthUIError) {
    //   // For merge conflicts, the error.code will be
    //   // 'firebaseui/anonymous-upgrade-merge-conflict'.
    //   if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
    //     return Promise.resolve();
    //   }

    //   const sign_in_anyway = window.confirm("An account for that user already exists. Signing in will erase times saved in anonymous mode. Are you sure you want to sign in?");

    //   if (sign_in_anyway) {
    //     // Delete the anonymous user
    //     if (firebase.auth().currentUser !== null && firebase.auth().currentUser!.isAnonymous) {
    //       firebase.auth().currentUser!.delete();
    //     }
    //     // The credential the user tried to sign in with.
    //     var cred = error.credential;
    //     // Finish sign-in.
    //     // return firebase.auth().signInWithCredential(cred);
    //     firebase.auth().signInWithCredential(cred);
    //   }
    //   return Promise.resolve();
    // },
  },
  signInFlow: 'redirect',
  signInSuccessUrl: '',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.EmailAuthProvider.PROVIDER_ID,
    // firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

interface Props {
  user: firebase.User | null;
}

class SignInForm extends React.PureComponent<Props> {
  render() {
    if (!this.props.user) {
      return (
        <div className="outline">
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
      );
    } else {
      return (
        <div className="pa2 tc">
          <a className="dark-blue no-underline underline-hover pointer" onClick={() => firebase.auth().signOut()}>{"Sign out " + this.props.user.displayName + "?"}</a>
        </div>
        )
    }
  }
}

export default SignInForm;