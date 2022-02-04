- sign up for a Here Developer plan at https://developer.here.com (they have free plans) and get an auth token. More info: https://developer.here.com/tutorials/harpgl/#acquire-credentials
- make a file `./imports/keys.js` here in this project, with you Here auth key:
  ```js
  export const harp = 'AUTH_KEY'
  ```
  where `AUTH_KEY` should be replaced with your Here Developer auth key.
- install Meteor: https://meteor.com
- install Node.js: https://nodejs.org
- run `npm install` in the project
- run `meteor`
- once the output says the app is running, visit http://localhost:3000
