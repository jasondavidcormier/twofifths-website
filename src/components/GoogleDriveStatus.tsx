import React, { useState, useEffect } from 'react';
import { Cloud, CheckCircle, AlertCircle, Clock, Activity } from 'lucide-react';
import { googleDriveAutoSync } from '../utils/googleDriveAutoSync';

const GoogleDriveStatus: React.FC = () => {
  const [status, setStatus] = useState(googleDriveAutoSync.getStatus());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Update status every few seconds
    const interval = setInterval(() => {
      setStatus(googleDriveAutoSync.getStatus());
    }, 5000);

    // Show status briefly when there's activity
    if (status.lastCheck && Date.now() - status.lastCheck < 10000) {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000);
    }

    return () => clearInterval(interval);
  }, [status.lastCheck]);

  // Show status when there are recent updates or errors
  const shouldShow = isVisible || 
    (status.lastError && Date.now() - (status.lastCheck || 0) < 60000) ||
    (status.lastSync && Date.now() - status.lastSync < 30000);

  if (!shouldShow) {
    return null;
  }

  const getStatusColor = () => {
    if (status.lastError) return 'bg-red-500';
    if (status.lastSync && Date.now() - status.lastSync < 30000) return 'bg-green-500';
    if (status.isRunning) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const getStatusText = () => {
    if (status.lastError) return 'Sync Error';
    if (status.lastSync && Date.now() - status.lastSync < 30000) return 'Content Updated';
    if (status.isRunning) return 'Checking for Updates';
    return 'Sync Inactive';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-3 max-w-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Cloud className="w-5 h-5 text-gray-600" />
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor()}`}></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Google Drive Sync
            </p>
            <p className="text-xs text-gray-500 truncate">
              {getStatusText()}
            </p>
          </div>

          {status.lastError && (
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          )}
          
          {status.lastSync && Date.now() - status.lastSync < 30000 && (
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          )}
          
          {status.isRunning && !status.lastError && (
            <Activity className="w-4 h-4 text-blue-500 flex-shrink-0 animate-pulse" />
          )}
        </div>

        {/* Stats */}
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>Checks: {status.checksPerformed}</span>
          <span>Syncs: {status.successfulSyncs}</span>
          {status.lastCheck && (
            <span>
              Last: {new Date(status.lastCheck).toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Error message */}
        {status.lastError && (
          <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
            {status.lastError}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleDriveStatus;