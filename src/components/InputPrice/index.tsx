import React from 'react';
import { TextInputProps } from 'react-native';

import {
  Container,
  Size,
  Label,
  Input
} from './styles';

type Props = TextInputProps & {
  size: string;
}

export const InputPrice: React.FC<Props> = ({ size, ...rest }) => {
  return (
    <Container>
      <Size>
        <Label>{ size }</Label>
      </Size>

      <Label>R$</Label>

      <Input keyboardType='numeric' {...rest} />
    </Container>
  );
}