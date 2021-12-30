import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';

import { ButtonBack } from '@components/ButtonBack';
import { InputPrice } from '@components/InputPrice';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Photo } from '@components/Photo';
import { ProductNavigationProps } from '../../@types/navigation';
import { ProductProps } from '@components/ProductCard';

import {
  Container,
  Header,
  Title,
  DeleteLabel,
  Upload,
  PickImageButton,
  Form,
  Label,
  InputGroup,
  InputGroupHeader,
  MaxCaracters
} from './styles';

type PizzaResponse = ProductProps & {
  photo_path: string;
  prices_sizes: {
    p: string;
    m: string;
    g: string;
  }
}

export const Product: React.FC = () => {

  const [photoPath, setPhotoPath] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceSizeP, setPriceSizeP] = useState('');
  const [priceSizeM, setPriceSizeM] = useState('');
  const [priceSizeG, setPriceSizeG] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as ProductNavigationProps;

  const handlePickerImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if(status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4]
      });

      if(!result.cancelled) setImage(result.uri);
    }
  }

  const handleAdd = async () => {
    try {
      if(!name.trim()) return Alert.alert('Cadastro', 'Informe o nome da pizza');
      if(!description.trim()) return Alert.alert('Cadastro', 'Informe a descrição da pizza');
      if(!image) return Alert.alert('Cadastro', 'Selecione a imagem da pizza');
      if(!priceSizeP || !priceSizeM || !priceSizeG) return Alert.alert('Cadastro', 'Informe o preço de todos os tamanhos da pizza');
  
      setIsLoading(true);

      const fileName = new Date().getTime();
      const reference = storage().ref(`/pizzas/${fileName}.png`);

      await reference.putFile(image);
      const photo_url = await reference.getDownloadURL();

      await firestore().collection('pizzas').add({
        name,
        name_insensitive: name.toLocaleLowerCase().trim(),
        description,
        prices_sizes: {
          p: priceSizeP,
          m: priceSizeM,
          g: priceSizeG
        },
        photo_url,
        photo_path: reference.fullPath
      });

      Alert.alert('Cadastro', 'Pizza cadastrada com sucesso!')

    } catch (error) {
        Alert.alert('Cadastro', 'Não foi possível cadastrar a pizza.')

        console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGetAllInfoPizza = async () => {
    if(id) {
      try {
        const response = await firestore().collection('pizzas').doc(id).get();

        const product = response.data() as PizzaResponse;

        setName(product.name);
        setPhotoPath(product.photo_path);
        setImage(product.photo_url);
        setDescription(product.description);
        setPriceSizeP(product.prices_sizes.p);
        setPriceSizeM(product.prices_sizes.m);
        setPriceSizeG(product.prices_sizes.g);
      } catch (error) {
        Alert.alert('Produto', 'Erro ao carregar as informações do produto.');
        console.error(error);
      }
    }
  }

  useEffect(() => {
    handleGetAllInfoPizza();
  }, [id]);

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Header>
          <ButtonBack onPress={navigation.goBack} />

          <Title>Cadastrar</Title>

          <TouchableOpacity>
            <DeleteLabel>Deletar</DeleteLabel>
          </TouchableOpacity>
        </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Upload>
          <Photo uri={image} />
          <PickImageButton title='Carregar' type='secondary' onPress={handlePickerImage} />
        </Upload>

        <Form>
          <InputGroup>
            <Label>Nome</Label>
            <Input onChangeText={setName} value={name} />
          </InputGroup>

          <InputGroup>
            <InputGroupHeader>
              <Label>Descrição</Label>
              <MaxCaracters>0 de 60 caracteres</MaxCaracters>
            </InputGroupHeader>
            <Input
              multiline
              maxLength={60}
              style={{ height: 80 }}
              onChangeText={setDescription}
              value={description}
            />
          </InputGroup>

          <InputGroup>
            <Label>Tamanhos e preços</Label>

            <InputPrice size='P' onChangeText={setPriceSizeP} value={priceSizeP} />
            <InputPrice size='M' onChangeText={setPriceSizeM} value={priceSizeM} />
            <InputPrice size='G' onChangeText={setPriceSizeG} value={priceSizeG} />
          </InputGroup>

          <Button 
            title='Cadastrar Pizza' 
            type='secondary' 
            isLoading={isLoading} 
            onPress={handleAdd}
          />
        </Form>
      </ScrollView>
    </Container>
  );
}