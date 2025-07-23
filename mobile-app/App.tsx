import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StripeProvider } from '@stripe/stripe-react-native';

// Screen imports
import HomeScreen from './src/screens/HomeScreen';
import BookingScreen from './src/screens/BookingScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import AdminScreen from './src/screens/AdminScreen';
import ServicesScreen from './src/screens/ServicesScreen';

const Stack = createStackNavigator();

const STRIPE_PUBLIC_KEY = 'pk_test_51Pu6RNHKN83pTkpd3CaXJz4ZyV7mTgQVk1uqWzxN1x4Q5vqKvCtNuE7k4jzH8Z2fB5rA3mY9wG8uH6dF7sJ3pL2x0nP';

export default function App() {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLIC_KEY}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#16a34a',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ 
                title: "Connie's Nail",
                headerShown: true
              }}
            />
            <Stack.Screen 
              name="Services" 
              component={ServicesScreen} 
              options={{ title: 'Services' }}
            />
            <Stack.Screen 
              name="Booking" 
              component={BookingScreen} 
              options={{ title: 'Book Appointment' }}
            />
            <Stack.Screen 
              name="Payment" 
              component={PaymentScreen} 
              options={{ title: 'Payment' }}
            />
            <Stack.Screen 
              name="Admin" 
              component={AdminScreen} 
              options={{ title: 'Admin Dashboard' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StripeProvider>
  );
}