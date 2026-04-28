import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config'

export async function signUp(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName })
  await setDoc(doc(db, 'users', cred.user.uid), {
    email,
    displayName,
    createdAt: serverTimestamp(),
  })
  return cred.user
}

export async function logIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export function logOut() {
  return signOut(auth)
}
