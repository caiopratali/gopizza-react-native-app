import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert, Platform } from 'react-native';

import { ButtonBack } from '@components/ButtonBack';
import { RadioButton } from '@components/RadioButton';
import { PIZZA_TYPES } from '../../utils/pizzaTypes';
import { Button } from '@components/Button';
import { ProductProps } from '@components/ProductCard';
import { Input } from '@components/Input';
import { OrderNavigationProps } from '@src/@types/navigation';
import { useAuth } from '@hooks/auth';

import {
  Container,
  Header,
  Photo,
  Sizes,
  Form,
  Title,
  Label,
  InputGroup,
  FormRow,
  Price,
  ContentScroll
} from './styles';

type PizzaResponse = ProductProps & {
  prices_sizes: {
    [key: string]: number;
  }
}

export const Order: React.FC = () => {

  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [tableNumber, setTableNumber] = useState('');
  const [sendingOrder, setSendingOrder] = useState(false);
  const [pizza, setPizza] = useState<PizzaResponse>({} as PizzaResponse);

  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as OrderNavigationProps;
  const { user } = useAuth();

  const amount = size ? pizza.prices_sizes[size] * quantity : '0,00';

  const handleGetAllInfoPizza = async () => {
    if(id) {
      try {
        const response = await firestore().collection('pizzas').doc(id).get();

        setPizza(response.data() as PizzaResponse);
      } catch (error) {
        Alert.alert('Pedido', 'Não foi possível carregar o produto');

        console.error(error);
      }
    }
  }

  const handleOrder = async () => {
    try {
      if(!size) return Alert.alert('Pedido', 'Selecione o tamanho da pizza.');
      if(!tableNumber) return Alert.alert('Pedido', 'Informe o número da mesa.');
      if(!quantity) return Alert.alert('Pedido', 'Informe a quantidade.');

      setSendingOrder(true);

      firestore().collection('orders').add({
        quantity,
        amount,
        pizza: pizza.name,
        size,
        tableNumber,
        status: 'Preparando',
        waiter_id: user?.id,
        image: pizza.photo_url
      });

      navigation.navigate('Home');
    } catch (error) {
      setSendingOrder(false);

      Alert.alert('Pedido', "Não foi possível realizar o pedido")

      console.error(error);
    }
  }

  useEffect(() => {
    handleGetAllInfoPizza();
  }, []);

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ContentScroll>
        <Header>
          <ButtonBack onPress={navigation.goBack} />
        </Header>
        
        <Photo source={{ uri: pizza.photo_url }} />

        <Form >
          <Title>{pizza.name}</Title>
          <Label>Selecione um tamanho</Label>

          <Sizes>
            {
              PIZZA_TYPES.map(item => (
                <RadioButton 
                  key={item.id}
                  title={item.name}
                  selected={size === item.id}
                  onPress={() => setSize(item.id)}
                />
              ))
            }
          </Sizes>

          <FormRow>
            <InputGroup>
              <Label>Número da mesa</Label>
              <Input keyboardType='numeric' onChangeText={setTableNumber} />
            </InputGroup>
            <InputGroup>
              <Label>Quantidade</Label>
              <Input keyboardType='numeric' onChangeText={(value) => setQuantity(Number(value))} />
            </InputGroup>
          </FormRow>

          <Price>Valor de R$ {amount}</Price>

          <Button 
            title='Confirmar pedido'
            onPress={handleOrder}
            isLoading={sendingOrder}
          />
        </Form>
      </ContentScroll>
    </Container>
  );
}