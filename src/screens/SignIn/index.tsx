import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useAuth } from '@hooks/auth';

import brandImg from '@assets/brand.png';

import {
  Container, 
  Content, 
  Title, 
  Brand,
  ForgoutPasswordButton,
  ForgoutPasswordLabel
} from './styles';

export const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, forgoutPassword, isLogging } = useAuth();

  const handleSignIn = () => {
    signIn(email, password);
  }

  const handleForgoutPassword = () => {
    forgoutPassword(email);
  }

  return (
    <Container>
     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Content>

        <Brand source={brandImg} />

        <Title>Login</Title>

        <Input 
          placeholder='E-mail' 
          type='secondary'
          autoCorrect={false}
          autoCapitalize='none'
          onChangeText={setEmail}
        />

        <Input 
          placeholder='Senha'
          type='secondary'
          secureTextEntry
          onChangeText={setPassword}
        /> 

        <ForgoutPasswordButton onPress={handleForgoutPassword} >
          <ForgoutPasswordLabel>Esqueci minha senha</ForgoutPasswordLabel>
        </ForgoutPasswordButton>

        <Button 
          title='Entrar' 
          type='secondary' 
          onPress={handleSignIn}
          isLoading={isLogging}
        />
      </Content>
     </KeyboardAvoidingView>
    </Container>
  );
}