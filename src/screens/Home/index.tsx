import React, { useCallback, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { Alert, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import happyEmoji from '@assets/happy.png';

import { Search } from '@components/Search';
import { ProductCard, ProductProps } from '@components/ProductCard';
import { useAuth } from '@hooks/auth';
import {
  Container,
  Header,
  Greeting,
  GreetingEmoji,
  GreetingText,
  SignOut,
  MenuHeader,
  MenuItemsNumber,
  Title,
  NewProductButton
} from './styles';

export const Home: React.FC = () => {

  const [pizzas, setPizzas] = useState<ProductProps[]>([]);
  const [search, setSearch] = useState('');

  const { signOut, user } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation();

  const fetchPizzas = async (value: string) => {
    try {
      const formattedValue = value.toLocaleLowerCase().trim();

      const response = await firestore()
      .collection('pizzas')
      .orderBy('name_insensitive')
      .startAt(formattedValue)
      .endAt(`${formattedValue}\uf8ff`)
      .get()
  
      const data = response.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }) as ProductProps[];

      setPizzas(data);
    } catch (error) {
      Alert.alert('Consulta', 'Não foi possível realizar a consulta.');

      console.error(error);
    }
  }

  const handleSearch = () => {
    fetchPizzas(search);
  }

  const handleSearchClear = () => {
    setSearch('');
    fetchPizzas('');
  }

  const handleOpen = (id: string) => {
    const route = user?.isAdmin ? 'Product' : 'Order';
    navigation.navigate(route, { id });
  }

  const handleAdd = () => {
    navigation.navigate('Product', {});
  }

  useFocusEffect(
    useCallback(() => {
      fetchPizzas('');
    }, [])
  );

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={happyEmoji} />
          <GreetingText>Olá, { user?.name }</GreetingText>
        </Greeting>
        <SignOut onPress={signOut}>
          <MaterialIcons name='logout' color={theme.COLORS.TITLE} size={24} />
        </SignOut>
      </Header>

      <Search
        onChangeText={setSearch}
        value={search}
        onSearch={handleSearch}
        onClear={handleSearchClear}
      />

      <MenuHeader>
        <Title>Cardápio</Title>
        <MenuItemsNumber>{pizzas.length} pizzas</MenuItemsNumber>
      </MenuHeader>

      <FlatList 
        data={pizzas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductCard 
            onPress={() => handleOpen(item.id)}
            data={item} 
          />
        )}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 125,
          marginHorizontal: 24
        }}
      />

      {
        user?.isAdmin &&
        <NewProductButton title='Cadastrar Pizza' type='secondary' onPress={handleAdd} />
      }
    </Container>
  );
}