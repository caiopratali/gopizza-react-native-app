import React from 'react';

import {
  Container,
  Title,
  Notification,
  Quantity
} from './styles';

type Props = {
  title: string;
  color: string;
  notifications?: string | undefined;
}

export const BottomMenu: React.FC<Props> = ({ title, notifications, color }) => {
  const noNotifications = notifications === '0';

  return (
    <Container>
      <Title color={color}>{ title }</Title>

      {
        notifications && 
        <Notification noNotification={noNotifications}>
          <Quantity noNotification={noNotifications}>
            { notifications }
          </Quantity>
        </Notification>
      }
    </Container>
  );
}