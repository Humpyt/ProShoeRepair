import React, { useEffect, useState } from 'react';
import { testFirestoreConnection } from '../utils/firestore-test';

const FirestoreTest = () => {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [message, setMessage] = useState('Testing Firestore connection...');

  useEffect(() => {
    const runTest = async () => {
      try {
        const result = await testFirestoreConnection();
        if (result) {
          setStatus('success');
          setMessage('Firestore is properly configured and connected!');
        } else {
          setStatus('error');
          setMessage('Failed to connect to Firestore. Check console for details.');
        }
      } catch (error) {
        setStatus('error');
        setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    runTest();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-4">Firestore Configuration Test</h1>
        
        <div className={`p-4 rounded-md ${
          status === 'testing' ? 'bg-blue-500/20 text-blue-200' :
          status === 'success' ? 'bg-green-500/20 text-green-200' :
          'bg-red-500/20 text-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {status === 'testing' && (
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"/>
            )}
            {status === 'success' && (
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {status === 'error' && (
              <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{message}</span>
          </div>
        </div>

        <div className="mt-4 text-gray-400 text-sm">
          <p>Check the browser console for detailed information about:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Connection status</li>
            <li>Number of users in database</li>
            <li>User roles configuration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FirestoreTest;
