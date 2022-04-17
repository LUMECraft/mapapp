# `mapapp`

An Open Source map-based application foundation.

LUMECraft's `mapapp` aims to be an application foundation for making multi-user
3D map-based apps. It is powered by [LUME](https://github.com/lume/lume) and
[Harp.gl](https://www.harp.gl/) for 3D globe map rendering,
[Solid.js](https://www.solidjs.com/) for reactivity and templating, and
[Meteor](https://www.meteor.com/) for full-stack real-time database reactivity.

# Demo

The latest stable features (i.e. the `main` branch) can be seen here:

https://mapapp.meteorapp.com

There is also a dev instance (i.e. from the `dev` branch) here:

https://mapapp.dev.meteorapp.com

Note that in these early stages, both are unstable and rapidly changing, and
practically the same, for now.

# Running

- sign up for a Here Developer plan at https://developer.here.com (they have free plans) and get an auth token. More info: https://developer.here.com/tutorials/harpgl/#acquire-credentials
- Open the file `./imports/keys.ts` here in this project, and put your Here auth key:
  ```js
  export const harp = 'AUTH_KEY'
  ```
  where `AUTH_KEY` should be replaced with your Here Developer auth key. Note
  for now that a free key is already provided by default inside `keys.ts`, and
  may not always work well or at all. You'll eventually want your own key.
- install Meteor: https://meteor.com
- install Node.js: https://nodejs.org
- run `npm install` in the project
- run `npm start`
- once the output says the app is running, visit http://localhost:3000
