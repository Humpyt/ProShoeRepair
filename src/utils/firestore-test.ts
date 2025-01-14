import { db } from '../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const testFirestoreConnection = async () => {
  try {
    // Try to fetch admin user
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("email", "==", "admin@shoerepair.com"));
    const snapshot = await getDocs(q);
    
    console.log('Firestore connection successful!');
    
    if (snapshot.empty) {
      console.log('Admin user not found in Firestore. Creating user document...');
      // You may want to create the user document here
    } else {
      console.log('Admin user found in Firestore:');
      snapshot.forEach((doc) => {
        const userData = doc.data();
        console.log({
          role: userData.role,
          name: userData.name,
          createdAt: userData.createdAt
        });
      });
    }

    return true;
  } catch (error) {
    console.error('Firestore connection error:', error);
    return false;
  }
};
