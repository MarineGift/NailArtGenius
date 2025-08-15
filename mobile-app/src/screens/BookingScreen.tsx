import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Card,
  TextInput,
  RadioButton,
  Portal,
  Modal,
} from 'react-native-paper';
import CalendarPicker from 'react-native-calendar-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BookingScreenProps {
  navigation: any;
  route: any;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ navigation, route }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('1');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [visitType, setVisitType] = useState<string>('appointment');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  ];

  const services = [
    { id: '1', name: 'Classic French Manicure', price: 45 },
    { id: '2', name: 'Floral Design', price: 65 },
    { id: '3', name: 'Geometric Pattern', price: 55 },
    { id: '4', name: 'Glitter & Sparkle', price: 70 },
    { id: '5', name: 'Minimalist Style', price: 40 },
    { id: '6', name: 'Seasonal Design', price: 60 },
    { id: '7', name: 'Wedding Special', price: 80 },
    { id: '8', name: 'Ombre Effect', price: 65 },
    { id: '9', name: '3D Art Design', price: 90 },
  ];

  useEffect(() => {
    // If service was selected from home screen
    if (route.params?.serviceId) {
      setSelectedService(route.params.serviceId.toString());
    }
  }, [route.params]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !customerName || !customerPhone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const selectedServiceData = services.find(s => s.id === selectedService);
    const discountedPrice = Math.round(selectedServiceData!.price * 0.9); // 10% discount

    const bookingData = {
      service: parseInt(selectedService),
      date: selectedDate.toISOString(),
      timeSlot: selectedTime,
      phone: customerPhone,
      customerName: customerName,
      visitType: visitType,
      originalPrice: selectedServiceData!.price.toFixed(2),
      discountedPrice: discountedPrice,
    };

    try {
      // Navigate to payment screen with booking data
      navigation.navigate('Payment', { bookingData });
    } catch (error) {
      Alert.alert('Error', 'Failed to process booking');
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.stepTitle}>Step 1: Select Date & Time</Text>
          
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowCalendar(true)}
          >
            <Icon name="calendar-today" size={20} color="#16a34a" />
            <Text style={styles.dateButtonText}>{formatDate(selectedDate)}</Text>
          </TouchableOpacity>

          {selectedDate && (
            <View style={styles.timeSlots}>
              <Text style={styles.timeSlotTitle}>Available Times:</Text>
              <View style={styles.timeGrid}>
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      selectedTime === time && styles.selectedTimeSlot,
                    ]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text
                      style={[
                        styles.timeSlotText,
                        selectedTime === time && styles.selectedTimeSlotText,
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.stepTitle}>Step 2: Select Service</Text>
          <RadioButton.Group
            onValueChange={setSelectedService}
            value={selectedService}
          >
            {services.map((service) => (
              <View key={service.id} style={styles.serviceOption}>
                <RadioButton value={service.id} />
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.servicePrice}>${service.price}</Text>
                </View>
              </View>
            ))}
          </RadioButton.Group>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.stepTitle}>Step 3: Customer Information</Text>
          
          <TextInput
            label="Customer Name"
            value={customerName}
            onChangeText={setCustomerName}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="Phone Number"
            value={customerPhone}
            onChangeText={setCustomerPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <Text style={styles.visitTypeLabel}>Visit Type:</Text>
          <RadioButton.Group
            onValueChange={setVisitType}
            value={visitType}
          >
            <View style={styles.visitTypeOption}>
              <RadioButton value="appointment" />
              <Text>Appointment Visit</Text>
            </View>
            <View style={styles.visitTypeOption}>
              <RadioButton value="first" />
              <Text>First Visit</Text>
            </View>
            <View style={styles.visitTypeOption}>
              <RadioButton value="online" />
              <Text>Online Booking</Text>
            </View>
          </RadioButton.Group>
        </Card.Content>
      </Card>

      {selectedServiceData && (
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text>Service:</Text>
              <Text style={styles.summaryValue}>{selectedServiceData.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Date:</Text>
              <Text style={styles.summaryValue}>{formatDate(selectedDate)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Time:</Text>
              <Text style={styles.summaryValue}>{selectedTime}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.originalPrice}>Original Price:</Text>
              <Text style={styles.originalPrice}>${selectedServiceData.price}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.discountPrice}>With 10% Online Discount:</Text>
              <Text style={styles.discountPrice}>
                ${Math.round(selectedServiceData.price * 0.9)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      <Button
        mode="contained"
        onPress={handleBooking}
        style={styles.bookButton}
        contentStyle={styles.bookButtonContent}
        disabled={!selectedDate || !selectedTime || !customerName || !customerPhone}
      >
        Continue to Payment (10% Discount)
      </Button>

      <Portal>
        <Modal
          visible={showCalendar}
          onDismiss={() => setShowCalendar(false)}
          contentContainerStyle={styles.calendarModal}
        >
          <CalendarPicker
            onDateChange={handleDateChange}
            minDate={new Date()}
            textStyle={{
              fontFamily: 'System',
              color: '#000000',
            }}
            selectedDayColor="#16a34a"
            selectedDayTextColor="#FFFFFF"
            todayBackgroundColor="#f0f9ff"
            scaleFactor={375}
          />
          <Button
            mode="text"
            onPress={() => setShowCalendar(false)}
            style={styles.closeButton}
          >
            Close
          </Button>
        </Modal>
      </Portal>
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
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#16a34a',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  dateButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#16a34a',
  },
  timeSlots: {
    marginTop: 16,
  },
  timeSlotTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '22%',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedTimeSlot: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTimeSlotText: {
    color: 'white',
    fontWeight: 'bold',
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 16,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  input: {
    marginBottom: 16,
  },
  visitTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  visitTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryCard: {
    backgroundColor: '#f0f9ff',
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#16a34a',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryValue: {
    fontWeight: '600',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  discountPrice: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#16a34a',
    marginTop: 16,
    marginBottom: 32,
  },
  bookButtonContent: {
    paddingVertical: 8,
  },
  calendarModal: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  closeButton: {
    marginTop: 16,
  },
});

export default BookingScreen;