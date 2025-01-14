import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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

async function createAdminUser() {
  try {
    // Create user in Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@shoerepair.com',
      'Admin123!'
    );

    const user = userCredential.user;
    console.log('User created successfully:', user.uid);

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: 'admin@shoerepair.com',
      role: 'admin',
      name: 'Admin User',
      createdAt: new Date().toISOString()
    });

    console.log('Admin user created successfully in both Auth and Firestore!');
    console.log('You can now log in with:');
    console.log('Email: admin@shoerepair.com');
    console.log('Password: Admin123!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();
