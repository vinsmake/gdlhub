import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { isTokenExpired, decodeJWT } from '../utils/tokenUtils';

export const TokenStatusBanner = () => {
  const { token } = useUser();
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [tokenStatus, setTokenStatus] = useState('No token');

  useEffect(() => {
    if (!token) {
      setTokenStatus('No token');
      setTimeRemaining(null);
      return;
    }

    const updateStatus = () => {
      const decoded = decodeJWT(token);
      if (!decoded || !decoded.exp) {
        setTokenStatus('Token inválido');
        setTimeRemaining(null);
        return;
      }

      const currentTime = Date.now() / 1000;
      const remaining = Math.max(0, decoded.exp - currentTime);
      
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        setTokenStatus('EXPIRADO');
      } else if (remaining <= 5) {
        setTokenStatus('EXPIRANDO PRONTO');
      } else {
        setTokenStatus('ACTIVO');
      }
    };

    // Update immediately
    updateStatus();
    
    // Update every second
    const interval = setInterval(updateStatus, 1000);
    
    return () => clearInterval(interval);
  }, [token]);

  if (!token) return null;

  const getStatusColor = () => {
    switch (tokenStatus) {
      case 'EXPIRADO': return '#ff4444';
      case 'EXPIRANDO PRONTO': return '#ff9944';
      case 'ACTIVO': return '#44ff44';
      default: return '#888888';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: getStatusColor(),
      color: 'white',
      padding: '8px',
      textAlign: 'center',
      fontWeight: 'bold',
      zIndex: 9999,
      fontSize: '14px'
    }}>
      🔑 Token Status: {tokenStatus} 
      {timeRemaining !== null && (
        <> | ⏱️ {timeRemaining > 0 ? `${timeRemaining.toFixed(1)}s restantes` : 'EXPIRADO'}</>
      )}
    </div>
  );
};