import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
`;

export const Content = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const Image = styled.Image`
  width: 104px;
  height: 104px;
  border-radius: 52px;
  margin-right: 20px;
`;

export const Details = styled.View`
  flex: 1;
`;

export const Name = styled.Text`
  flex: 1;
  font-size: 20px;
  font-family: ${({ theme }) => theme.FONTS.TITLE};
  color: ${({ theme }) => theme.COLORS.SECONDARY_900};
`;

export const Identification = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Description = styled.Text`
  font-size: 12px;
  line-height: 20px;
  margin-right: 21px;
  font-family: ${({ theme }) => theme.FONTS.TEXT};
  color: ${({ theme }) => theme.COLORS.SECONDARY_400};
`;

export const Line = styled.View`
  height: 1px;
  width: 100%;
  margin: 12px 0 12px 124px;
  background-color: ${({ theme }) => theme.COLORS.SHAPE};
`;