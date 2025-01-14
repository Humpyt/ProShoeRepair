import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAUDG_4bTWzGXAEqwohxBrqCX0jaOy5YJs",
  authDomain: "shoe-repair-pos.firebaseapp.com",
  projectId: "shoe-repair-pos",
  storageBucket: "shoe-repair-pos.appspot.com",
  messagingSenderId: "948337484624",
  appId: "1:948337484624:web:caca74f072d776a988c255"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const email = 'admin@shoerepair.com';
const password = 'Admin123!';

async function createOrVerifyAdminUser() {
  try {
    // First try to sign in
    console.log('Attempting to sign in...');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Successfully signed in! User exists:', userCredential.user.uid);
      
      // Ensure Firestore document exists
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        role: 'admin',
        name: 'Admin User',
        createdAt: new Date().toISOString()
      }, { merge: true });
      
      console.log('User document updated in Firestore');
    } catch (signInError) {
      console.log('Sign-in failed, creating new user...');
      
      // Create new user
      const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('New user created:', newUserCredential.user.uid);
      
      // Create Firestore document
      await setDoc(doc(db, 'users', newUserCredential.user.uid), {
        uid: newUserCredential.user.uid,
        email: email,
        role: 'admin',
        name: 'Admin User',
        createdAt: new Date().toISOString()
      });
      
      console.log('User document created in Firestore');
    }
    
    console.log('\nAdmin user is ready!');
    console.log('Email:', email);
    console.log('Password:', password);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createOrVerifyAdminUser();
