// src/components/ScheduleTrigger.js
import { useEffect, useState } from 'react';

export default function ScheduleTrigger({ onScheduleChange, initialSchedule = null }) {
  const [frequency, setFrequency] = useState('day');
  const [time, setTime] = useState('09:00');

  useEffect(() => {
    const [hour, minute] = time.split(':');
    let cronString = '';

    if (frequency === 'day') {
      cronString = `${minute} ${hour} * * *`; 
    } else if (frequency === 'week') {
      cronString = `${minute} ${hour} * * 1`;
    } else if (frequency === 'hour') {
      cronString = `0 * * * *`;
    }
    
    onScheduleChange(cronString);
  }, [frequency, time, onScheduleChange]);
  
  useEffect(() => {
    if (initialSchedule) {
      const parts = initialSchedule.split(' ');
      const minute = parts[0];
      const hour = parts[1];
      if (minute !== '*' && hour !== '*') {
        setTime(`${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`);
      }
    }
  }, [initialSchedule]);

  return (
    <div className="flex gap-x-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white font-bold">2</div>
      <div className="flex-1 space-y-4 pt-1">
        <h3 className="text-lg font-semibold text-slate-700">Configure Schedule</h3>
        <div className="flex items-center gap-4">
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="p-3 border border-slate-300 rounded-lg">
            <option value="hour">Every Hour</option>
            <option value="day">Every Day</option>
            <option value="week">Every Week (on Mondays)</option>
          </select>
          {frequency !== 'hour' && (
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="p-3 border border-slate-300 rounded-lg" />
          )}
        </div>
        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
          <p className="font-semibold">This zap will run automatically based on the schedule you set. No testing is required.</p>
        </div>
      </div>
    </div>
  );
}