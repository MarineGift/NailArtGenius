import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Button, Card, ActivityIndicator } from 'react-native-paper';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PaymentScreenProps {
  navigation: any;
  route: any;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
  const { bookingData } = route.params;
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();

  const handlePayment = async () => {
    if (!stripe) {
      Alert.alert('Error', 'Stripe is not initialized');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent on server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: bookingData.discountedPrice,
          currency: 'usd',
          bookingDetails: bookingData,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        Alert.alert('Payment Failed', error.message);
      } else if (paymentIntent.status === 'Succeeded') {
        Alert.alert(
          'Payment Successful',
          'Your appointment has been booked successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home'),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Icon name="payment" size={24} color="#16a34a" />
            <Text style={styles.headerTitle}>Payment Details</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Complete your appointment booking with secure payment
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.detailsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service:</Text>
            <Text style={styles.detailValue}>Service #{bookingData.service}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time:</Text>
            <Text style={styles.detailValue}>
              {formatDate(bookingData.date)} at {bookingData.timeSlot}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Customer:</Text>
            <Text style={styles.detailValue}>{bookingData.customerName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{bookingData.phone}</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, styles.originalPrice]}>Original Price:</Text>
            <Text style={[styles.detailValue, styles.originalPrice]}>
              ${bookingData.originalPrice}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, styles.discountPrice]}>
              With 10% Online Discount:
            </Text>
            <Text style={[styles.detailValue, styles.discountPrice]}>
              ${bookingData.discountedPrice}
            </Text>
          </View>
          
          <View style={styles.savingsBox}>
            <Icon name="savings" size={16} color="#16a34a" />
            <Text style={styles.savingsText}>
              You saved ${bookingData.originalPrice - bookingData.discountedPrice} with online payment!
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.paymentCard}>
        <Card.Content>
          <View style={styles.paymentHeader}>
            <Icon name="credit-card" size={24} color="#16a34a" />
            <Text style={styles.paymentTitle}>Secure Payment</Text>
          </View>
          
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentInfoText}>
              💳 <Text style={styles.bold}>Card Scanning Available:</Text> Use your phone camera 
              to scan your card for faster input, or enter details manually.
            </Text>
          </View>
          
          <View style={styles.securityInfo}>
            <Icon name="security" size={20} color="#16a34a" />
            <Text style={styles.securityText}>
              Secure payment powered by Stripe with 256-bit SSL encryption
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handlePayment}
        style={styles.payButton}
        contentStyle={styles.payButtonContent}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="small" color="white" />
            <Text style={styles.processingText}>Processing Payment...</Text>
          </View>
        ) : (
          `Pay $${bookingData.discountedPrice} Now`
        )}
      </Button>
      
      <Text style={styles.disclaimer}>
        By proceeding with payment, you agree to our terms of service and 
        confirm that all booking details are correct.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#16a34a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  detailsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  discountPrice: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
  savingsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  savingsText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '600',
  },
  paymentCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#f8f9fa',
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#16a34a',
  },
  paymentInfo: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  paymentInfoText: {
    fontSize: 14,
    color: '#1565c0',
  },
  bold: {
    fontWeight: 'bold',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
  payButton: {
    backgroundColor: '#16a34a',
    marginBottom: 16,
  },
  payButtonContent: {
    paddingVertical: 12,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processingText: {
    marginLeft: 8,
    color: 'white',
    fontSize: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 32,
  },
});

export default PaymentScreen;