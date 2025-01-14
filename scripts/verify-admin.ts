import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAUDG_4bTWzGXAEqwohxBrqCX0jaOy5YJs",
  authDomain: "shoe-repair-pos.firebaseapp.com",
  projectId: "shoe-repair-pos",
  storageBucket: "shoe-repair-pos.firebasestorage.app",
  messagingSenderId: "948337484624",
  appId: "1:948337484624:web:caca74f072d776a988c255"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function verifyAndFixAdminUser() {
  const email = 'admin@shoerepair.com';
  const password = 'Admin123!';

  try {
    // First try to sign in
    console.log('Attempting to sign in with existing credentials...');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Successfully signed in! User exists.');
      
      // Check if user document exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (!userDoc.exists()) {
        console.log('User document missing in Firestore. Creating it...');
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: email,
          role: 'admin',
          name: 'Admin User',
          createdAt: new Date().toISOString()
        });
        console.log('User document created in Firestore');
      } else {
        console.log('User document exists in Firestore:', userDoc.data());
      }
    } catch (signInError) {
      console.log('Sign-in failed, attempting to create new user...');
      // If sign-in fails, try to create new user
      const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', newUserCredential.user.uid), {
        uid: newUserCredential.user.uid,
        email: email,
        role: 'admin',
        name: 'Admin User',
        createdAt: new Date().toISOString()
      });
      
      console.log('New admin user created successfully!');
    }
    
    console.log('\nYou can now log in with:');
    console.log('Email:', email);
    console.log('Password:', password);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Sign out after verification
    await auth.signOut();
  }
}

verifyAndFixAdminUser();
