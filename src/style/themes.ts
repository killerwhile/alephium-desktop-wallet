import { DefaultTheme } from 'styled-components'

export const lightTheme: DefaultTheme = {
  name: 'light',
  bg: {
    primary: '#ffffff',
    secondary: 'rgba(61, 64, 74, 0.05)',
    tertiary: 'rgba(61, 64, 74, 0.2)',
    contrast: '#1b202f'
  },
  font: {
    primary: '#1b202f',
    secondary: '#797979',
    contrast: '#ffffff'
  },
  border: {
    primary: '#E8E8E8'
  },
  global: {
    accent: '#489CFF',
    secondary: '#FFC73B',
    alert: '#FF8372',
    valid: '#4ACF34'
  }
}
