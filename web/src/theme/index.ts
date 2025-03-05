import { MantineThemeOverride } from '@mantine/core';

// Yume theme
const colors = {
  yume_white: [
    '#FFFFFF', '#FCFCFC', '#F9F9F9', '#F6F6F6', '#F2F2F2',
    '#EBEBEB', '#E5E5E5', '#DFDFDF', '#D9D9D9', '#D3D3D3',
  ] as [string, string, string, string, string, string, string, string, string, string],
  yume_grey: [
    '#F7F7F7', '#E8E8E8', '#D9D9D9', '#CACACA', '#C1C1C1',
    '#A9A9A9', '#919191', '#797979', '#616161', '#494949',
  ] as [string, string, string, string, string, string, string, string, string, string],
  yume_grey2: [
    '#E9E9E9', '#D2D2D2', '#BBBBBB', '#A4A4A4', '#8D8D8D',
    '#6C6C6C', '#565656', '#404040', '#2A2A2A', '#141414',
  ] as [string, string, string, string, string, string, string, string, string, string],
  yume_black: [
    '#DADADA', '#B3B3B3', '#8C8C8C', '#666666', '#404040',
    '#171717', '#141414', '#0F0F0F', '#0A0A0A', '#050505',
  ] as [string, string, string, string, string, string, string, string, string, string],
  yume_black2: [
    '#E0E0E0', '#B9B9B9', '#929292', '#6B6B6B', '#454545',
    '#171717E6', '#171717B3', '#17171780', '#1717174D', '#1717171A',
  ] as [string, string, string, string, string, string, string, string, string, string],
  yume_orange: [
    '#FFF5ED', '#FFE7D3', '#FFD8B8', '#FFC99D', '#FBB580',
    '#FB8607', '#D26F06', '#A95705', '#804004', '#572803',
  ] as [string, string, string, string, string, string, string, string, string, string],
  yume_pink: [
    '#FFE5ED', '#FFC0D3', '#FF9AB8', '#FF75A0', '#FF4F87',
    '#FE247B', '#D61D64', '#AE164D', '#860E36', '#5E0720',
  ] as [string, string, string, string, string, string, string, string, string, string],
  yume_blue: [
    '#EDF5FF', '#D0E4FF', '#B3D4FF', '#96C3FF', '#79B2FF',
    '#2B78FC', '#235FCA', '#1B4798', '#123066', '#0A1834',
  ] as [string, string, string, string, string, string, string, string, string, string],
  yume_green: [
    '#E5FAF0', '#BFF3D9', '#9AEBBF', '#75E4A8', '#50DD91',
    '#06CE6B', '#05A555', '#047C40', '#02532A', '#012914',
  ] as [string, string, string, string, string, string, string, string, string, string],
  yume_red: [
    '#FFE5EB', '#FFBFCA', '#FF99A9', '#FF7488', '#FF4E66',
    '#FE2436', '#D61E2E', '#AE1725', '#860F1C', '#5E0813',
  ] as [string, string, string, string, string, string, string, string, string, string],
};

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Montserrat',
  shadows: { sm: '1px 1px 3px rgba(0, 0, 0, 0.5)' },

  colors: {
    white: colors.yume_white,
    grey: colors.yume_grey,
    grey2: colors.yume_grey2,
    black: colors.yume_black,
    black2: colors.yume_black2,
    orange: colors.yume_orange,
    pink: colors.yume_pink,
    blue: colors.yume_blue,
    green: colors.yume_green,
    red: colors.yume_red,
  },
  primaryColor: 'yume_blue',

  components: {
    Button: {
      styles: {
        root: {
          border: 'none',
        },
      },
    },
  },
};
