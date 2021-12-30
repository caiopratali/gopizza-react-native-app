import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import {
  Container,
  Title,
  Load,
  TypeProps
} from './styles';

type Props = TouchableOpacityProps & {
  title: string;
  type?: TypeProps;
  isLoading?: boolean;
}

export const Button: React.FC<Props> = ({ title, type = 'primary', isLoading = false, ...rest }) => {
  return (
    <Container type={type} disabled={isLoading} {...rest}>
      { isLoading ? <Load /> : <Title>{ title }</Title> }
    </Container>
  );
}