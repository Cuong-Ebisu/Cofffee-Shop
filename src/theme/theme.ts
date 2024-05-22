interface Spacing {
  space_2: number;
  space_4: number;
  space_8: number;
  space_10: number;
  space_12: number;
  space_15: number;
  space_16: number;
  space_18: number;
  space_20: number;
  space_24: number;
  space_28: number;
  space_30: number;
  space_32: number;
  space_36: number;
  space_40: number;
  space_45: number;
  space_50: number;
}

export const SPACING: Spacing = {
  space_2: 2,
  space_4: 4,
  space_8: 8,
  space_10: 10,
  space_12: 12,
  space_15: 15,
  space_16: 16,
  space_18: 18,
  space_20: 20,
  space_24: 24,
  space_28: 28,
  space_30: 30,
  space_32: 32,
  space_36: 36,
  space_40: 40,
  space_45: 45,
  space_50: 50,
};

interface Color {
  primaryRedHex: string;
  primaryOrangeHex: string;
  primaryBlackHex: string;
  Cyan: string;
  TurquoiseBlue: string;
  Azure: string;
  MidnightGreen: string;
  LightCyan: string;
  primaryDarkGreyHex: string;
  secondaryDarkGreyHex: string;
  primaryGreyHex: string;
  secondaryGreyHex: string;
  primaryLightGreyHex: string;
  secondaryLightGreyHex: string;
  primaryWhiteHex: string;
  primaryBlackRGBA: string;
  secondaryBlackRGBA: string;
  WhiteSmoke: string;
  WoodBrown: string;
  primary: string;
  white: string;
  black: string;
  lightGrey: string;
  darkGrey: string;
  OtterBrown: string;
  AliceBlue: string;
  SpanishBistre: string;
  CosmicLatte: string;
  primaryLightWoodBrown: string;
  TuscanBrown: string;
  primaryLightSpanishBistre: string;
  SandyBrown: string;
  Bisque: string;
}

export const COLORS: Color = {
  primaryRedHex: '#DC3535',
  primaryOrangeHex: '#D17842',
  primaryBlackHex: '#0C0F14',
  Cyan: '#00ffff',
  TurquoiseBlue: '#00ffef',
  Azure: '#f0ffff',
  MidnightGreen: '#004953',
  LightCyan: '#e0ffff',
  primaryDarkGreyHex: '#141921',
  secondaryDarkGreyHex: '#21262E',
  primaryGreyHex: '#252A32',
  secondaryGreyHex: '#252A32',
  primaryLightGreyHex: '#52555A',
  secondaryLightGreyHex: '#AEAEAE',
  primaryWhiteHex: '#FFFFFF',
  primaryBlackRGBA: 'rgba(12,15,20,0.5)',
  secondaryBlackRGBA: 'rgba(0,0,0,0.7)',
  WhiteSmoke: "#f5f5f5",
  WoodBrown: '#c19a6b',
  primary: '#00695C',
  white: '#FFFFFF',
  black: '#000000',
  lightGrey: '#D3D3D3',
  darkGrey: '#808080',
  OtterBrown: '#654321',
  AliceBlue: '#f0f8ff',
  SpanishBistre: '#80755a',
  CosmicLatte: '#fff8e7',
  primaryLightWoodBrown: 'rgba(193, 154, 107, 0.5)',
  TuscanBrown: '#6f4e37',
  primaryLightSpanishBistre: 'rgba(128, 117, 90, 0.5)',
  SandyBrown: '#f4a460',
  Bisque: '#ffe4c4',
};

interface FontFamily {
  poppins_black: string;
  poppins_bold: string;
  poppins_extrabold: string;
  poppins_extralight: string;
  poppins_light: string;
  poppins_medium: string;
  poppins_regular: string;
  poppins_semibold: string;
  poppins_thin: string;
  regular: string;
  bold: string;
}

export const FONTFAMILY: FontFamily = {
  poppins_black: 'Poppins-Black',
  poppins_bold: 'Poppins-Bold',
  poppins_extrabold: 'Poppins-ExtraBold',
  poppins_extralight: 'Poppins-ExtraLight',
  poppins_light: 'Poppins-Light',
  poppins_medium: 'Poppins-Medium',
  poppins_regular: 'Poppins-Regular',
  poppins_semibold: 'Poppins-SemiBold',
  poppins_thin: 'Poppins-Thin',
  regular: 'Arial-Regular',
  bold: 'Arial-Bold',
};

interface FontSize {
  size_8: number;
  size_10: number;
  size_12: number;
  size_14: number;
  size_16: number;
  size_18: number;
  size_20: number;
  size_24: number;
  size_28: number;
  size_30: number;
}

export const FONTSIZE: FontSize = {
  size_8: 8,
  size_10: 10,
  size_12: 12,
  size_14: 14,
  size_16: 16,
  size_18: 18,
  size_20: 20,
  size_24: 24,
  size_28: 28,
  size_30: 30,
};

interface BorderRadius {
  radius_4: number;
  radius_8: number;
  radius_10: number;
  radius_15: number;
  radius_20: number;
  radius_25: number;
}

export const BORDERRADIUS: BorderRadius = {
  radius_4: 4,
  radius_8: 8,
  radius_10: 10,
  radius_15: 15,
  radius_20: 20,
  radius_25: 25,
};
