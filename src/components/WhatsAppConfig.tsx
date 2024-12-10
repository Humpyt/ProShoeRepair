import React, { useState, useEffect } from 'react';
import { whatsappService } from '../services/whatsapp';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function WhatsAppConfig() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const connected = await whatsappService.testConnection();
      setIsConnected(connected);
    } catch (error) {
      setIsConnected(false);
      console.error('Connection test error:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="card-bevel p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">WhatsApp Business Configuration</h2>
        <button
          className="btn-bevel p-2 rounded-lg"
          onClick={testConnection}
          disabled={isLoading}
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span>Connection Status:</span>
          {isConnected === null ? (
            <span className="text-gray-400">Checking...</span>
          ) : isConnected ? (
            <div className="flex items-center text-green-500">
              <CheckCircle className="h-5 w-5 mr-1" />
              Connected
            </div>
          ) : (
            <div className="flex items-center text-red-500">
              <XCircle className="h-5 w-5 mr-1" />
              Not Connected
            </div>
          )}
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Required Environment Variables:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            <li>VITE_WHATSAPP_API_URL</li>
            <li>VITE_WHATSAPP_PHONE_NUMBER_ID</li>
            <li>VITE_WHATSAPP_ACCESS_TOKEN</li>
          </ul>
        </div>

        {!isConnected && (
          <div className="bg-yellow-900 text-yellow-200 p-4 rounded-lg text-sm">
            <p className="font-medium">Troubleshooting Steps:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Verify your WhatsApp Business Account is set up</li>
              <li>Check that your Phone Number ID is correct</li>
              <li>Ensure your Access Token is valid and has the correct permissions</li>
              <li>Verify your templates are approved in the WhatsApp Business Manager</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
