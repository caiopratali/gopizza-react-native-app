import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import {
  Container,
  Title,
  Radio,
  Selected,
  RadioButtonProps
} from './styles';

type Props = TouchableOpacityProps & RadioButtonProps & {
  title: string;
}

export const RadioButton: React.FC<Props> = ({ title, selected = false, ...rest }) => {
  return (
    <Container selected={selected} {...rest}>
      <Radio>{ selected && <Selected /> }</Radio>

      <Title>{ title }</Title>
    </Container>
  );
}