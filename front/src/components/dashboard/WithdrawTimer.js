import React from 'react';
import { useTimer } from 'react-timer-hook';

export default function WithdrawTimer({ expiryTimestamp, setWithdrawable }) {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
    onExpire: () => setWithdrawable(true)
  });

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '20px' }}>
        <span>
          {days}Days {hours}Hrs {minutes}Mins {seconds}Secs
        </span>
      </div>
    </div>
  );
}
