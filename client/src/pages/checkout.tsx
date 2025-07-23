import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, Scan } from "lucide-react";
import { useLocation } from "wouter";

// Load Stripe outside of component render to avoid recreating the Stripe object
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface BookingDetails {
  service: number;
  date: string; // Date is stored as ISO string in sessionStorage
  timeSlot: string;
  phone: string;
  originalPrice: string | number;
  discountedPrice: number;
}

const CheckoutForm = ({ bookingDetails }: { bookingDetails: BookingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking?payment=success`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Your appointment payment has been processed with 10% discount!",
        });
        setLocation('/booking?payment=success');
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred during payment processing.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
          <CardDescription>
            Complete your appointment booking with secure payment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Service:</span>
              <span>Service #{bookingDetails.service}</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <span>{new Date(bookingDetails.date).toLocaleDateString()} at {bookingDetails.timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{bookingDetails.phone}</span>
            </div>
            <hr />
            <div className="flex justify-between text-gray-500 line-through">
              <span>Original Price:</span>
              <span>${bookingDetails.originalPrice}</span>
            </div>
            <div className="flex justify-between font-semibold text-green-600">
              <span>With 10% Online Discount:</span>
              <span>${bookingDetails.discountedPrice}</span>
            </div>
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
              💳 You saved ${Number(bookingDetails.originalPrice) - bookingDetails.discountedPrice} with online payment!
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Card Payment with Scanning
          </CardTitle>
          <CardDescription>
            Use card scanning for easy payment or enter details manually
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
              <strong>Card Scanning Available:</strong> Use your phone camera to scan your card for faster input, or enter details manually below.
            </div>
            
            <PaymentElement 
              options={{
                layout: "tabs",
                paymentMethodOrder: ['card'],
                fields: {
                  billingDetails: 'never'
                },
                // Enable card scanning on mobile devices
                wallets: {
                  applePay: 'auto',
                  googlePay: 'auto'
                }
              }}
            />
            
            <Button 
              type="submit" 
              disabled={!stripe || isProcessing}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ${bookingDetails.discountedPrice} (10% Discount Applied)
                </>
              )}
            </Button>
            
            <div className="text-xs text-gray-500 text-center">
              🔒 Secure payment powered by Stripe. Your card information is encrypted and secure.
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Checkout page loaded, checking for booking details...');
    
    // Get booking details from sessionStorage
    const savedBookingDetails = sessionStorage.getItem('pendingBookingPayment');
    console.log('Saved booking details:', savedBookingDetails);
    
    if (!savedBookingDetails) {
      console.log('No booking details found, redirecting to booking page');
      toast({
        title: "No Payment Required",
        description: "No pending payment found. Redirecting to booking page.",
        variant: "destructive",
      });
      setLocation('/booking');
      return;
    }

    const booking = JSON.parse(savedBookingDetails);
    console.log('Parsed booking:', booking);
    setBookingDetails(booking);

    // Create payment intent using apiRequest (which handles JSON parsing)
    console.log('Creating payment intent with data:', { 
      amount: booking.discountedPrice,
      currency: 'usd',
      bookingDetails: booking
    });
    
    apiRequest("/api/create-payment-intent", "POST", { 
      amount: booking.discountedPrice,
      currency: 'usd',
      bookingDetails: booking
    })
      .then((data) => {
        console.log('Payment intent response:', data);
        if (data.clientSecret) {
          console.log('Setting client secret:', data.clientSecret);
          setClientSecret(data.clientSecret);
        } else {
          throw new Error('No client secret received from server');
        }
      })
      .catch((error) => {
        console.error('Payment intent creation failed:', error);
        toast({
          title: "Payment Setup Failed", 
          description: `Unable to initialize payment: ${error.message}`,
          variant: "destructive",
        });
      });
  }, [setLocation, toast]);

  console.log('Render state - clientSecret:', !!clientSecret, 'bookingDetails:', !!bookingDetails);
  
  if (!clientSecret || !bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-medium">Setting up secure payment...</p>
          <p className="text-sm text-gray-600 mt-2">Please wait while we prepare your checkout</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="text-gray-600 mt-2">Secure checkout with 10% online discount</p>
        </div>
        
        <Elements 
          stripe={stripePromise} 
          options={{ 
            clientSecret,
            locale: 'en',
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#16a34a',
                colorBackground: '#ffffff',
                colorText: '#1f2937',
                colorDanger: '#dc2626',
                fontFamily: 'system-ui, sans-serif',
                borderRadius: '8px'
              }
            }
          }}
        >
          <CheckoutForm bookingDetails={bookingDetails} />
        </Elements>
      </div>
    </div>
  );
}