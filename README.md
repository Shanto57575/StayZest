# StayZest

StayZest is a Full-Featured booking application that allows users to explore and book holiday destinations. It offers seamless payment integration, review management, and an AI-powered trip planner. StayZest also provides an admin dashboard for managing the app's content and user interactions.

## Features

### User Features

- **Place Details**: Users can view detailed information about holiday destinations and make bookings through the Stripe payment gateway.
- **Review Management**: Users can add, update, or delete reviews for places they have visited.
- **AI Trip Planner**: Generates personalized trip plans based on user preferences.
- **User Dashboard**: Users can manage their profiles, view booking history, booking statistics, and update personal information.
- **Dark/Light Mode**: The dashboard supports both dark and light themes for an enhanced user experience.

### Admin Features

- **Admin Dashboard**: Provides an overview of app statistics, including trending locations and total users.
- **Content Management**: Admins can add new places, manage bookings, payments, and reviews.
- **User Management**: Admins have the ability to promote users to admin status.
- **Booking Management**: Admins can confirm or cancel bookings, and view payment status and booking statistics.
- **Review Management**: Admins can update or delete any reviews.

### Home Page Features

- **Sorting & Filtering**: Users can sort places by price (high to low, low to high), filter by country, and search for specific destinations.

## Technologies Used

- **Frontend**: React.js, Tailwind CSS, Material-UI (MUI)
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT tokens for user authentication, Firebase for Google OAuth
- **State Management**: Redux Toolkit
- **Payment Integration**: Stripe
- **Deployment**: Backend on Render.com, Frontend on Firebase

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Shanto57575/StayZest
   ```
2. Navigate to the project directory: `cd StayZest`

3. Install backend dependencies:

```
cd backend
npm install
```

4. Install frontend dependencies:

```
cd frontend
npm install
```

5. Set up environment variables in the `.env `file for backend and `.env.local` for frontend.

6. Start the development server for both frontend and backend: `npm run dev`

## Live Demo

Check out the live version of the app here: [StayZest Live](https://stayzest-cbf59.web.app)
