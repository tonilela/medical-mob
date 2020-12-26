import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          TabOne: {
            screens: {
              TabOneScreen: 'one',
            },
          },
          Profile: {
            screens: {
              Profile: 'profile',
            },
          },
          Chart: {
            screens: {
              Chart: 'chart',
            },
          },
          // TabTwo: {
          //   screens: {
          //     TabTwoScreen: 'two',
          //   },
          // },
        },
      },
      NotFound: '*',
    },
  },
};
