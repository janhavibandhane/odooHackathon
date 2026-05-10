# Setup Instructions

## Backend Setup
1. Navigate to the backend directory:
   `cd BackendSetupMain`
2. Install the backend dependencies:
   `npm install cors express mongoose dotenv bcrypt jsonwebtoken`
   *(Note: I updated your package.json to fix a typo 'cores' to 'cors')*
3. Rename `.env.example` to `.env` and update your `MONGODB_URI` if necessary.
4. Start the backend server:
   `npm start` or `node index.js`

## Frontend Setup
1. Navigate to the frontend directory:
   `cd BfrontedMain/my-app`
2. Install the required additional frontend dependencies:
   `npm install react-router-dom axios react-toastify react-hook-form lucide-react clsx tailwind-merge`
3. Start the frontend dev server:
   `npm run dev`

You are good to go!
