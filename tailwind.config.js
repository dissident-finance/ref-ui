const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: false,
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      xs: { min: '300px', max: '600px' },
      md: { min: '600px', max: '1023px' },
      lg: { min: '1024px' },
      lg2: { min: '1092px' },
      xl: { min: '1280px' },
      '2xl': { min: '1536px' },
      '3xl': { min: '1792px' },
    },
    boxShadow: {
      '4xl': '0px 0px 10px 4px rgba(0, 0, 0, 0.35)',
      green: '0px 0px 2px rgba(0, 198, 162, 0.5)',
      dark: '0px 0px 10px rgba(0, 0, 0, 0.15)',
    },

    extend: {
      backgroundImage: (theme) => ({
        farmSearch: 'linear-gradient(106.25deg, #00FFD1 6.88%, #00BA98 81.93%)',
        stableTab: 'linear-gradient(180deg, #00C6A2 0%, #008B72 100%)',
        primaryGradient: 'linear-gradient(180deg, #00C6A2 0%, #008B72 100%)',
        buttonGradientBg: 'linear-gradient(180deg, #00C6A2 0%, #008B72 100%)',
        darkGradientBg: 'linear-gradient(180deg, #1D2932 0%, #001320 100%)',
        darkGradientHoverBg:
          'linear-gradient(180deg, #24313A 0%, #14212B 100%)',
      }),
      gridTemplateColumns: {
        farmSearch: '2fr 1fr',
        farmContainer: '1fr 4fr',
        farmContainerOther: '1.2fr 3fr',
        xrefColumn: '7fr 13fr',
      },
      gridTemplateRows: {
        xrefContainer: '7fr 18fr',
        xrefRowM: '2fr 3fr',
        xrefContainerM: '2fr 3fr',
      },
      colors: {
        primary: '#10B981',
        primaryScale: colors.green,
        secondary: '#F9FAFB',
        secondaryScale: colors.gray,
        darkText: colors.gray['600'],
        inputBg: colors.gray['100'],
        inputText: '#374151',
        hoverGray: '#F3F4F6',
        buttonBg: '#10B981',
        buttonText: '#F9FAFB',
        greenLight: '#00C08B',
        greenOpacity100: 'rgba(2, 109, 97, 1)',
        whiteOpacity85: 'rgba(255, 255, 255, 0.85)',
        blackLight: '#003648',
        greenLight1: '#01C08B',
        cardBg: '#1D2932',
        chartBg: '#001320',
        warn: '#DEA550',
        error: '#DE5050',
        gradientFrom: '#00c6a2',
        gradientTo: '#008b72',
        gradientFromHover: '#00D6AF',
        gradientToHover: '#00967B',
        poolRowHover: '#001320',
        primaryText: '#7E8A93',
        inputDarkBg: 'rgba(0, 0, 0, 0.2)',
        navHighLightBg: '#304452',
        navHighLightText: '#C6D1DA',
        slipBg: '#3e4e59',
        farmText: '#73818B',
        farmSplitLine: '#314351',
        farmDark: '#2B3A44',
        framBorder: '#00C6A2',
        farmSbg: '#2F3D47',
        farmRound: '#B3C2CC',
        farmTopRight: '#008870',
        datebg: '#637684',
        xrefbg: '#0F1D27',
        greenColor: '#00C6A2',
        xrefTab: '#293741',
        borderColor: '#7e8a93',
        warnColor: '#DE9450',
        BTCColor: '#F38632',
        NEARBlue: '#418DFF',
        acccountTab: '#0F1D27',
        acccountBlock: '#293741',
        xREFColor: '#A7ABAD',
        purple: '#8c78ff',
        blueTip: '#0A7AFF',
        darkGreenColor: '#009A2B',
        riskTextColor: '#BEBEBE',
        senderHot: '#00FFD1',
        auroraGreen: '#70D44B',
        triPool: '#329DFF',
        refPool: '#00C6A2',
        lightGreenColor: '#70d44b',
        tabChosen: '#4A5862',
        liqBtn: '#141D24',
        priceBoardColor: '#172128',
        lightRedColor: '#FF7575',
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      width: {
        '25vw': '25vw',
        '35vw': '35vw',
        '40vw': '40vw',
        '95vw': '95vw',
        '580px': '580px',
        '560px': '560px',
        '360px': '360px',
        '80vw': '80vw',
        '90vw': '90vw',
        '30vw': '30vw',
        '480px': '480px',
        smartRoute: '292px',
        54: '13.5rem',
        34: '8.5rem',
      },
    },
    plugins: [],
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      borderWidth: ['hover'],
      backgroundImage: ['hover'],
      cursor: ['disabled'],
      padding: ['last'],
      display: ['hover'],
    },
  },
};
