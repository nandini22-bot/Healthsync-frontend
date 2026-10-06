import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Bell, X, Pill } from 'lucide-react';

export default function MedicationAlertManager() {
  const [reminders, setReminders] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [lastCheckTime, setLastCheckTime] = useState('');

  // Request browser notification permissions
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    loadReminders();
    // Refresh reminder schedules every 5 minutes
    const fetchInterval = setInterval(loadReminders, 5 * 60 * 1000);
    return () => clearInterval(fetchInterval);
  }, []);

  const loadReminders = async () => {
    try {
      const data = await api.medication.getReminders();
      setReminders(data);
    } catch (err) {
      console.warn('[Medication Alert Manager] Failed to load reminders:', err.message);
    }
  };

  // Poll current time every 15 seconds to trigger alerts
  useEffect(() => {
    const timeCheckInterval = setInterval(() => {
      const now = new Date();
      // Format as HH:MM
      const currentHHMM = now.toTimeString().substring(0, 5);
      
      if (currentHHMM !== lastCheckTime) {
        setLastCheckTime(currentHHMM);
        checkAlarms(currentHHMM);
      }
    }, 15000);

    return () => clearInterval(timeCheckInterval);
  }, [reminders, lastCheckTime]);

  const checkAlarms = (currentTime) => {
    reminders.forEach(rem => {
      // Clean times string e.g. "08:00"
      if (rem.times === currentTime) {
        triggerAlert(rem);
      }
    });
  };

  const triggerAlert = (reminder) => {
    // 1. Trigger OS/Browser push notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Medication Alert: ${reminder.medicine_name}`, {
        body: `Time to take your dosage: ${reminder.dosage} (${reminder.frequency})`,
        icon: '/favicon.ico'
      });
    }

    // 2. Add to local floating UI toast alarms
    const alertId = Date.now() + Math.random().toString(36).substring(2, 7);
    setActiveAlerts(prev => [...prev, { id: alertId, ...reminder }]);

    // Auto dismiss after 15 seconds
    setTimeout(() => {
      dismissAlert(alertId);
    }, 15000);
  };

  const dismissAlert = (id) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  if (activeAlerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm w-full">
      {activeAlerts.map(alert => (
        <div 
          key={alert.id} 
          className="bg-[#111d3f] border border-blue-500/30 text-white p-4.5 rounded-2xl shadow-2xl flex items-start gap-3.5 animate-slide-in relative"
        >
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/25">
            <Pill className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
              <Bell className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
              <span>Dosing Alarm</span>
            </h5>
            <p className="text-sm font-extrabold truncate text-white">{alert.medicine_name}</p>
            <p className="text-xs text-gray-400 mt-1 font-semibold">Dosage: {alert.dosage} • Time: {alert.times}</p>
          </div>
          <button 
            onClick={() => dismissAlert(alert.id)}
            className="absolute top-3 right-3 text-gray-500 hover:text-white p-1 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
