import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (message: any) => void;
  lastMessage: any;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    // For now, we'll simulate WebSocket connection
    // In a real implementation, you would connect to your backend WebSocket server
    const mockSocket = {
      send: (message: any) => {
        console.log('WebSocket message sent:', message);
        // Simulate receiving a response
        setTimeout(() => {
          setLastMessage({ type: 'response', data: message });
        }, 100);
      },
      close: () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
      }
    };

    setSocket(mockSocket as any);
    setIsConnected(true);

    return () => {
      if (mockSocket) {
        mockSocket.close();
      }
    };
  }, []);

  const sendMessage = (message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  };

  const value: WebSocketContextType = {
    isConnected,
    sendMessage,
    lastMessage
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}; 