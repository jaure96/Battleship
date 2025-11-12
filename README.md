# Battleship

A modern implementation of the classic Battleship game with a web landing page and a mobile application. Play against other players in real-time multiplayer matches.

## Project Structure

This is a monorepo containing two main applications:

### `landing-page/`

A responsive web landing page built with React, TypeScript, and Vite. This serves as the marketing and information hub for the Battleship application.

**Tech Stack:**

- React 18
- TypeScript
- Vite
- Tailwind CSS
- ESLint

**Features:**

- Responsive design
- Game screenshots and feature showcase
- Privacy policy page
- Optimized performance

### `mobile-app/`

A cross-platform mobile application built with React Native and Expo. This is the main game application where users can play Battleship matches.

**Tech Stack:**

- React Native
- Expo
- TypeScript
- Supabase (Backend)
- NativeWind (Tailwind CSS for React Native)
- AdMob (Monetization)

**Features:**

- Real-time multiplayer gameplay
- Create and join battle rooms
- Game board management
- Match results tracking
- Toast notifications
- AdMob integration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Expo CLI (for mobile app development)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/jaure96/Battleship.git
cd Battleship
```

2. Install dependencies for both projects:

```bash
# Install landing page dependencies
cd landing-page
pnpm install

# Install mobile app dependencies
cd ../mobile-app
pnpm install
```

### Development

#### Landing Page

```bash
cd landing-page
pnpm run dev
```

The landing page will be available at `http://localhost:5173`

**Available Scripts:**

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

#### Mobile App

```bash
cd mobile-app
pnpm start
```

Then use Expo Go app on your mobile device to scan the QR code, or use an emulator.

**Available Scripts:**

- `pnpm start` - Start Expo development server
- `pnpm run android` - Run on Android emulator
- `pnpm run ios` - Run on iOS simulator
- `pnpm run lint` - Run ESLint
- `pnpm run build` - Build for production

### Environment Configuration

The mobile app requires Supabase configuration. Create a `.env.local` file in the `mobile-app/` directory with your Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Architecture & Code Organization

### Component Structure

- **Functional Components**: All components are built as functional components using React hooks
- **Small & Focused**: Components are kept small and focused on a single responsibility
- **Custom Hooks**: Reusable logic is extracted into custom hooks
- **Composition**: Components use composition over inheritance
- **TypeScript**: Proper prop types are implemented with TypeScript

### State Management

- **Local State**: `useState` for component-level state
- **Complex State**: `useReducer` for complex state logic
- **Shared State**: Context API for shared state across components
- **Proximity**: State is kept as close as possible to where it's used
- **No Prop Drilling**: Proper state management prevents prop drilling

### Performance Optimization

- **Memoization**: `useMemo` and `useCallback` are used appropriately
- **Component Memoization**: `React.memo` for expensive components
- **Lazy Loading**: Proper lazy loading implementation
- **Key Props**: Correct key props in lists
- **Render Optimization**: Unnecessary re-renders are avoided

### Hooks Guidelines

- **Rules of Hooks**: All hooks follow React's Rules of Hooks
- **Custom Hooks**: Reusable logic is extracted into custom hooks
- **Focused Hooks**: Hooks are kept focused and simple
- **Dependency Arrays**: Proper dependency arrays in `useEffect`
- **Cleanup**: Cleanup functions are implemented in `useEffect` when needed

### Forms

- **Controlled Components**: Form inputs are controlled components
- **Validation**: Proper form validation is implemented
- **Submission States**: Form submission states are handled properly
- **Error States**: Appropriate loading and error states are shown
- **Accessibility**: Forms have proper accessibility attributes

### Error Handling

- **Error Boundaries**: Error boundaries are implemented for error handling
- **Async Errors**: Async errors are handled properly
- **User-Friendly Messages**: Error messages are user-friendly
- **Fallback UI**: Proper fallback UI is provided
- **Error Logging**: Errors are logged appropriately
- **Edge Cases**: Edge cases are handled gracefully

### Testing

- **Unit Tests**: Unit tests for components
- **Integration Tests**: Integration tests for complex flows
- **React Testing Library**: React Testing Library is used for testing
- **User Interactions**: User interactions are tested
- **Error Scenarios**: Error scenarios are tested
- **Mock Data**: Proper mock data is implemented

### Accessibility

- **Semantic HTML**: Semantic HTML elements are used
- **ARIA Attributes**: Proper ARIA attributes are implemented
- **Keyboard Navigation**: Keyboard navigation is ensured
- **Screen Readers**: Testing with screen readers
- **Focus Management**: Proper focus management
- **Alt Text**: Proper alt text for images

## Project Features

### Landing Page Features

- Responsive design for all devices
- Feature showcase with cards
- Step-by-step game instructions
- Privacy policy page
- App screenshots gallery
- Call-to-action buttons

### Mobile App Features

- **Real-time Multiplayer**: Play against other players in real-time
- **Room Management**: Create public rooms or join existing ones
- **Game Board**: Interactive game board for ship placement and attacks
- **Match Results**: Track match results and statistics
- **Notifications**: Toast notifications for game events
- **Monetization**: AdMob integration for ads
- **Responsive UI**: Optimized for various screen sizes

## Database Schema

The mobile app uses Supabase with the following main tables:

- **Players**: User information and statistics
- **Matches**: Match records and results
- **Moves**: Game moves and attacks
- **Ships**: Ship placement and status

See `mobile-app/supabase/query/` for detailed SQL schemas and RLS policies.

## Development Guidelines

### Code Style

- Follow standard coding conventions for each language
- Use SOLID principles and clean code practices
- Maintain high modularity with small, concise files
- Use proper file naming conventions
- Implement proper directory structure

### Configuration

- Never hardcode user data, passwords, API keys, or connection URLs
- Use environment variables or configuration files
- Keep sensitive information in `.env` files (not committed to git)

### Documentation

- Update relevant documentation in the `/docs` folder
- Maintain this README.md in sync with new capabilities
- Document complex component logic
- Include comments in code where necessary

### Git Workflow

- Create feature branches for new features
- Write clear commit messages
- Submit pull requests for review
- Keep commits atomic and focused

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Deployment

### Landing Page

The landing page is configured for deployment on Vercel. See `landing-page/vercel.json` for configuration.

### Mobile App

The mobile app can be built and deployed using Expo Application Services (EAS). See `mobile-app/eas.json` for configuration.

## Resources

- [React Documentation](https://react.dev)
- [React Native Documentation](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
