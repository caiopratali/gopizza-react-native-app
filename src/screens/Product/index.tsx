import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';

import { ButtonBack } from '@components/ButtonBack';
import { InputPrice } from '@components/InputPrice';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Photo } from '@components/Photo';

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

export const Product: React.FC = () => {

  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceSizeP, setPriceSizeP] = useState('');
  const [priceSizeM, setPriceSizeM] = useState('');
  const [priceSizeG, setPriceSizeG] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Header>
          <ButtonBack />

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