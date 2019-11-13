import firebase from '../../config/fbConfig'

/** 
 * @method signIn
 * @description Represents our function for signing in through email with Firebase.
 * @param {object} credentials - crendentials for the users who is logging in.
 * @param {string} credentials.email - email of the user logging in.
 * @param {string} credentials.password - password of the user logging in.
 * @returns {null} 
 */


export const signIn = (credentials) => {
  return (dispatch, getState) => {

    // Make async call to database
    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    ).then(() => {
        dispatch({type: 'LOGIN_SUCCESS'})
    }).catch((err) => {
        dispatch({type: 'LOGIN_ERROR', err})
    })
  }
}

/** 
 * @method signUp
 * @description Represents our function for signing up through email with Firebase.
 * @param {object} newUser - crendentials for the users who is logging in.
 * @param {string} newUser.name - name of the user who just signed up.
 * @param {string} newUser.email - email of the user who just signed up.
 * @param {string} newUser.password - password of the user who just signed up.
 * @returns {null}
 */

export const signUp = (newUser) => {
  return (dispatch, getState, {getFirestore}) => {

    const firestore = getFirestore()

    firebase.auth().createUserWithEmailAndPassword(
      newUser.email,
      newUser.password
    ).then((resp) => {
      firestore.collection('users').doc(resp.user.uid).set({
        name: newUser.name,
        initials: newUser.name[0]
      })
    }).then(() => {
      dispatch({ type: 'SIGNUP_SUCCESS' })
    }).catch(err => {
      dispatch({ type: 'SIGNUP_ERROR', err})
    })
  }
}

/** 
 * @method signOut
 * @description Represents our function for logging out users.
 * @param {function} dispatch - a function through which Redux dispatches an action.
 * @param {function} getState - a function that returns the current state of the Redux store.
 * @returns {Object}
 */

export const signOut = () => {
  return (dispatch, getState) => {
    firebase.auth().signOut().then(() => {
      dispatch({type: 'SIGNOUT_SUCCESS'})
    })
  }
}