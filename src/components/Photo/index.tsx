import React from 'react';

import {
  Image,
  Placeholder,
  PlaceholderTitle
} from './styles';

type Props = {
  uri: string | null;
}

export const Photo: React.FC<Props> = ({ uri }) => {
  return (
    uri ? 
    <Image source={{ uri }} /> : 
    <Placeholder>
      <PlaceholderTitle>Nenhuma foto{'\n'}carregada</PlaceholderTitle>
    </Placeholder>
  );
}