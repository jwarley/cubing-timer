import * as React from "react";
import * as firebase from "firebase/app";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import "firebase/auth";

const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult: firebase.auth.UserCredential, redirectUrl: string) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return false;
    }
  },
  signInFlow: 'redirect',
  signInSuccessUrl: '',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
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
        <div className="outline">
          <p> Signed in as {this.props.user.displayName} </p>
          <a className="ba pointer" onClick={() => firebase.auth().signOut()}>Sign out</a>
        </div>
        )
    }
  }
}

export default SignInForm;