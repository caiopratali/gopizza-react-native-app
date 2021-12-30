import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Alert, FlatList } from 'react-native';

import { OrderCard, OrderProps } from '@components/OrderCard';
import { ItemSeparator } from '@components/ItemSeparator';
import { useAuth } from '@hooks/auth';

import {
  Container, 
  Header,
  Title
} from './styles';

export const Orders: React.FC = () => {

  const [ orders, setOrders ] = useState<OrderProps[]>([]);

  const { user } = useAuth();

  const handlePizzaDelivered = (id: string) => {
    Alert.alert('Pedido', 'Deseja confirmar que a pizza foi entregue?', [
      {
        text: 'Não',
        style: 'cancel'
      },
      {
        text: 'Sim',
        onPress: () => {
          firestore().collection('orders').doc(id).update({
            status: 'Entregue'
          });
        }
      }
    ]);
  }

  useEffect(() => {
    const subscribe = firestore()
    .collection('orders')
    .where('waiter_id', '==', user?.id)
    .onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }) as OrderProps[];

      setOrders(data);
    });

    return () => subscribe();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Pedidos Feitos</Title>
      </Header>
      
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 125 }}
        ItemSeparatorComponent={() => <ItemSeparator />}
        renderItem={({ item, index }) => (
          <OrderCard 
            index={index} 
            data={item} 
            disabled={item.status === 'Entregue'}
            onPress={() => handlePizzaDelivered(item.id)}
          />
        )}
      />
    </Container>
  );
}