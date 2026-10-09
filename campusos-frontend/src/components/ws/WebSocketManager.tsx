import React, { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useQueryClient } from '@tanstack/react-query';
import { Notice } from '../../types';

export const WebSocketManager: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { addToast, incrementNoticeCount } = useNotificationStore();
  const queryClient = useQueryClient();
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      return;
    }

    try {
      // Connect via SockJS fallback or WebSocket
      const client = new Client({
        webSocketFactory: () => {
          try {
            return new SockJS('/ws/campusos');
          } catch (err) {
            console.warn('Failed to initialize SockJS client', err);
            return null as any;
          }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      onConnect: () => {
        // Subscribe to global announcements
        client.subscribe('/topic/notices/all', (message) => {
          try {
            const notice: Notice = JSON.parse(message.body);
            incrementNoticeCount();
            addToast({
              type: 'info',
              title: `📢 ${notice.title}`,
              message: notice.content.substring(0, 80) + (notice.content.length > 80 ? '...' : ''),
            });
            queryClient.invalidateQueries({ queryKey: ['notices'] });
          } catch (e) {
            console.error('Failed to parse websocket message', e);
          }
        });

        // Role-specific channel subscriptions
        if (user?.role === 'ROLE_STUDENT') {
          client.subscribe('/topic/notices/student', (message) => {
            try {
              const notice: Notice = JSON.parse(message.body);
              incrementNoticeCount();
              addToast({
                type: 'info',
                title: `🎓 Student Notice: ${notice.title}`,
                message: notice.content,
              });
              queryClient.invalidateQueries({ queryKey: ['notices'] });
            } catch (e) {
              console.error('Failed to parse websocket message', e);
            }
          });
        }

        if (user?.role === 'ROLE_FACULTY') {
          client.subscribe('/topic/notices/faculty', (message) => {
            try {
              const notice: Notice = JSON.parse(message.body);
              incrementNoticeCount();
              addToast({
                type: 'info',
                title: `📋 Faculty Notice: ${notice.title}`,
                message: notice.content,
              });
              queryClient.invalidateQueries({ queryKey: ['notices'] });
            } catch (e) {
              console.error('Failed to parse websocket message', e);
            }
          });
        }
      },
      onStompError: (frame) => {
        console.warn('STOMP broker error:', frame.headers['message']);
      },
    });

      client.activate();
      clientRef.current = client;

      return () => {
        client.deactivate();
        clientRef.current = null;
      };
    } catch (error) {
      console.warn('Failed to start STOMP client:', error);
    }
  }, [isAuthenticated, user, addToast, incrementNoticeCount, queryClient]);

  return null;
};
