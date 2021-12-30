import styled from 'styled-components/native';

export type RadioButtonProps = {
  selected: boolean;
}

export const Container = styled.TouchableOpacity<RadioButtonProps>`
  width: 104px;
  height: 82px;
  border-radius: 8px;
  padding: 14px 16px;
  border: 1px solid ${({ selected, theme }) => selected ? theme.COLORS.SUCCESS_900 : theme.COLORS.SHAPE};
  background-color: ${({ selected, theme }) => selected ? theme.COLORS.SUCCESS_50 : theme.COLORS.TITLE};
`;

export const Title = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.FONTS.TITLE};
  color: ${({ theme }) => theme.COLORS.SECONDARY_900};
`;

export const Radio = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.COLORS.SECONDARY_900};
  margin-bottom: 16px;
  justify-content: center;
  align-items: center;
`;

export const Selected = styled.View`
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: ${({ theme }) => theme.COLORS.SUCCESS_900};
`;