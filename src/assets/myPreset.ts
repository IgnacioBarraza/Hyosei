import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const myPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{neutral.50}',
      100: '{neutral.100}',
      200: '{neutral.200}',
      300: '{neutral.300}',
      400: '{neutral.400}',
      500: '{neutral.500}',
      600: '{neutral.600}',
      700: '{neutral.700}',
      800: '{neutral.800}',
    },
    colorScheme: {
      ligth: {
        primary: {
          color: '{neutral.600}',
          inverseColor: '#ffffff',
          hoverColor: '{neutral.700}',
          activeColor: '{neutral.800}',
        },
        highlight: {
          background: '{neutral.950}',
          focusBackground: '{neutral.900}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
      dark: {
        primary: {
          color: '{neutral.50}',
          inverseColor: '{neutral.950}',
          hoverColor: '{neutral.100}',
          activeColor: '{neutral.200}',
        },
        highlight: {
          background: '{neutral.950}',
          focusBackground: '{neutral.900}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
    },
  },
});

export default myPreset;
