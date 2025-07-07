import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, Settings, Clock, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { autoSyncManager, AutoSyncConfig, AutoSyncStatus, AutoSyncEvent } from '../utils/autoSyncManager';

interface AutoSyncControlsProps {
  onStatusChange?: (status: AutoSyncStatus) => void;
}

const AutoSyncControls: React.FC<AutoSyncControlsProps> = ({ onStatusChange }) => {
  const [config, setConfig] = useState<AutoSyncConfig>(autoSyncManager.getConfig());
  const [status, setStatus] = useState<AutoSyncStatus>(autoSyncManager.getStatus());
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [recentEvents, setRecentEvents] = useState<AutoSyncEvent[]>([]);
  const [timeUntilNext, setTimeUntilNext] = useState<string | null>(null);

  // Initialize auto-sync manager
  useEffect(() => {
    const initializeAutoSync = async () => {
      try {
        await autoSyncManager.initialize();
        setConfig(autoSyncManager.getConfig());
        setStatus(autoSyncManager.getStatus());
      } catch (error) {
        console.error('Failed to initialize auto-sync:', error);
      }
    };

    initializeAutoSync();
  }, []);

  // Subscribe to status changes
  useEffect(() => {
    const unsubscribe = autoSyncManager.addEventListener((event) => {
      setRecentEvents(prev => [event, ...prev.slice(0, 4)]); // Keep last 5 events
      
      // Update status after events
      const newStatus = autoSyncManager.getStatus();
      setStatus(newStatus);
      
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    });

    return unsubscribe;
  }, [onStatusChange]);

  // Update countdown timer
  useEffect(() => {
    if (!status.isRunning) {
      setTimeUntilNext(null);
      return;
    }

    const updateTimer = () => {
      const timeLeft = autoSyncManager.getFormattedTimeUntilNextCheck();
      setTimeUntilNext(timeLeft);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [status.isRunning, status.nextCheck]);

  const handleToggleAutoSync = async () => {
    setIsLoading(true);
    try {
      if (status.isRunning) {
        autoSyncManager.stop();
      } else {
        // Update config to enable auto-sync
        autoSyncManager.updateConfig({ enabled: true });
        autoSyncManager.start();
      }
      setStatus(autoSyncManager.getStatus());
    } catch (error) {
      console.error('Failed to toggle auto-sync:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    setIsLoading(true);
    try {
      await autoSyncManager.triggerManualSync();
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceCheck = async () => {
    setIsLoading(true);
    try {
      await autoSyncManager.forceCheck();
    } catch (error) {
      console.error('Force check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigUpdate = (newConfig: Partial<AutoSyncConfig>) => {
    autoSyncManager.updateConfig(newConfig);
    setConfig(autoSyncManager.getConfig());
  };

  const stats = autoSyncManager.getStats();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">Auto-Sync</h3>
        </div>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Status Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              status.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm font-medium text-gray-700">
              {status.isRunning ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          {timeUntilNext && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Next check: {timeUntilNext}</span>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-gray-900">{stats.checksPerformed}</div>
            <div className="text-xs text-gray-600">Checks</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-green-700">{stats.successfulSyncs}</div>
            <div className="text-xs text-gray-600">Syncs</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-blue-700">{stats.successRate.toFixed(0)}%</div>
            <div className="text-xs text-gray-600">Success</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <button
          onClick={handleToggleAutoSync}
          disabled={isLoading}
          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            status.isRunning
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          } disabled:opacity-50`}
        >
          {status.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{status.isRunning ? 'Stop' : 'Start'}</span>
        </button>

        <button
          onClick={handleManualSync}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Now</span>
        </button>

        <button
          onClick={handleForceCheck}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Check Now</span>
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Auto-Sync Settings</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check Interval (seconds)
              </label>
              <select
                value={config.interval / 1000}
                onChange={(e) => handleConfigUpdate({ interval: parseInt(e.target.value) * 1000 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={10}>10 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
                <option value={600}>10 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Retries
              </label>
              <select
                value={config.maxRetries}
                onChange={(e) => handleConfigUpdate({ maxRetries: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={1}>1 retry</option>
                <option value={3}>3 retries</option>
                <option value={5}>5 retries</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retry Delay (seconds)
              </label>
              <select
                value={config.retryDelay / 1000}
                onChange={(e) => handleConfigUpdate({ retryDelay: parseInt(e.target.value) * 1000 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={2}>2 seconds</option>
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Recent Events */}
      {recentEvents.length > 0 && (
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
          <div className="space-y-2">
            {recentEvents.map((event, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                {event.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                {event.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                {event.type === 'checking' && <RefreshCw className="w-4 h-4 text-blue-500" />}
                {event.type === 'syncing' && <Activity className="w-4 h-4 text-purple-500" />}
                {!['success', 'error', 'checking', 'syncing'].includes(event.type) && (
                  <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                )}
                
                <span className="text-gray-700">{event.message}</span>
                <span className="text-gray-500 text-xs ml-auto">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">How Auto-Sync Works:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Automatically checks Google Drive for content updates</li>
          <li>• Downloads and applies changes to the live site</li>
          <li>• Configurable check intervals and retry logic</li>
          <li>• Manual sync and check options available</li>
        </ul>
      </div>
    </div>
  );
};

export default AutoSyncControls;