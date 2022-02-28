import { publish } from 'gh-pages';

publish(
 'build', // path to public directory
 {
  branch: 'gh-pages',
  repo: 'https://github.com/chasedawson/local-warming.git', // Update to point to your repository
  user: {
   name: 'Chase Dawson', // update to use your name
   email: 'scd3dz@virginia.edu' // Update to use your email
  },
  dotfiles: true
  },
  () => {
   console.log('Deploy Complete!');
  }
);