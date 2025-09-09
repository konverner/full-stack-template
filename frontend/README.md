# Full-Stack Template - Frontend

## Overview

The frontend is written with TypeScript and the following modules:

  - **React** for building user interfaces with a component-based architecture.

  - **Vite** for a lightweight development server and build tool.

  - **Material UI** for UI/UX components

  - **OpenAPI-TS** for client generation

  - **Nginx** for serving the frontend and reverse proxy

## Structure

The project follows a modular and component-based structure defined by "[React Thinking](https://react.dev/learn/thinking-in-react)".

Within the components and pages directories, the project is organized by feature. For example, all components and pages related to "items" are grouped together in components/items and pages/items. This makes it easy to find all the code related to a single feature and promotes code maintainability.

```
├── App.tsx             # Main application component and router configuration
├── client              # Generated API client from OpenAPI specifications
├── components          # Reusable UI components
│   ├── common          # Shared components used across different pages (e.g., headers, footers)
│   │   ├── Footer.tsx
│   │   └── Header.tsx
│   ├── items           # Components related to the 'items' feature
│   │   ├── CreateForm.tsx
│   │   ├── Details.tsx
│   │   ├── EditForm.tsx
│   │   └── Table.tsx
│   └── users           # Components related to the 'users' feature
│       ├── CreateForm.tsx
│       ├── Details.tsx
│       ├── EditForm.tsx
│       └── Table.tsx
├── main.tsx            # Entry point of the application, renders the App component
├── pages               # Page-level components that represent full views/routes
│   ├── about.tsx
│   ├── auth            # Pages for authentication (login, register, profile)
│   │   ├── login.tsx
│   │   ├── profile.tsx
│   │   └── register.tsx
│   ├── contact.tsx
│   ├── faq.tsx
│   ├── index.tsx       # The landing page or home page
│   ├── items           # Pages for the 'items' feature
│   │   ├── Create.tsx
│   │   ├── Details.tsx
│   │   ├── Edit.tsx
│   │   └── Table.tsx
│   ├── privacy.tsx
│   ├── terms.tsx
│   └── users           # Pages for the 'users' feature
│       ├── Create.tsx
│       ├── Details.tsx
│       ├── Edit.tsx
│       └── Table.tsx
└── utils               # Utility functions and helpers
    └── auth.ts         # Utility functions for authentication logic
```

## Development

### Set and run development server

You need to install npm on your machine. Once it is done, within the frontend directory, install the necessary NPM packages:

```bash
npm install
```

And start the live server with the following npm script:

```bash
npm run dev
```

### Creating a new feature

It is recommended to respect the existing pattern:

1.  Create components for new feature in `/components/{feature_name}`
2.  Ensemble the components in a new page `/pages/{feature_name}/feature-page.tsx`
3.  Add a route to the page in `App.tsx`

### Generate client

If changes to the backend were made, they must be reflected in the frontend.

We can generate TypeScript code for the client automatically with OpenAPI specifications provided by FastAPI on our backend:

1.  Set and install a virtual environment for the backend in `backend/venv`.
2.  From the project root, run the script:

```bash
sudo bash ./scripts/generate-client.sh
```
