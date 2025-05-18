# SpickApp

## Development

### Requirements

- [Node.js](https://nodejs.org)
- [npm](https://www.npmjs.com)
- [Ionic CLI](https://ionicframework.com/docs/intro/cli) - `npm install -g @ionic/cli`

### Libraries

- [Vite](https://vitejs.dev)
- [React](https://react.dev)
- [Ionic](https://ionicframework.com)
- [Typescript](https://www.typescriptlang.org)
- [React Router](https://reactrouter.com)
- [Redux](https://redux.js.org)
- [Capacitor](https://capacitorjs.com)

### How to run

1. Clone project
2. `npm install`
3. `npm run dev`

> [!WARNING]
> If you have eslint errors, disable it in your editor.

## Architecture

### Structure

The project is divided into multiple folders, each with a specific purpose.

- `src` - contains the application's source code
  - `components` - contains reusable components
    - `core` - contains components used strictly for design, without business logic or functionality
  - `pages` - contains the application's pages
  - `reducers` - contains Redux reducers or application-level states
  - `storage` - contains the application's local storage, i.e., locally saved data
  - `service` - contains code for server communication as well as data processing
  - `model` - contains the data models used in the application

Other files in the `src` folder:

- `App.tsx` - contains the main component
- `main.tsx` - contains the startup code
- `store.ts` - contains the Redux store
- `Layout.tsx` - contains the layout, which is applied to all pages

> [!NOTE]  
> As you can see, all model helpers are in a `utils` file within the `service` folder. The idea is to decouple the model from the components so that we can easily modify the model without affecting code across the entire application.

> [!IMPORTANT]  
> The flow for local data in the application is as follows: data is saved in a store in the `storage` folder and then loaded into the Redux store in `App.tsx`. This is done to easily access and modify data from any component.

## Deployment

Currently, the application is *automatically* hosted on GitHub Pages, but it can be hosted on any other static hosting service.

Additionally, it also allows for the creation of mobile applications using Capacitor. To create a mobile app, follow the steps [here](https://capacitorjs.com/docs/getting-started).
