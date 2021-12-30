import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import {
  Container,
  Name,
  Description,
  Image,
  StatusLabel,
  StatusContainer,
  StatusTypesProps
} from './styles';

export type OrderProps = {
  id: string;
  pizza: string;
  image: string;
  status: StatusTypesProps;
  tableNumber: string;
  quantity: string;
}

type Props = TouchableOpacityProps & {
  index: number;
  data: OrderProps;
}

export const OrderCard: React.FC<Props> = ({ index, data, ...rest }) => {
  return (
    <Container index={index} {...rest}>
      <Image source={{ uri: data.image }} />

      <Name>{ data.pizza }</Name>
      <Description>Mesa { data.tableNumber } - Qtd: { data.quantity }</Description>

      <StatusContainer status={data.status}>
        <StatusLabel status={data.status}>{ data.status }</StatusLabel>
      </StatusContainer>
    </Container>
  );
}