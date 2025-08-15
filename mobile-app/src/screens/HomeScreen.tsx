import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const services = [
    {
      id: 1,
      name: 'Classic French Manicure',
      price: '$45',
      description: 'Traditional French manicure style',
      image: require('../assets/service1.jpg'),
    },
    {
      id: 2,
      name: 'Floral Design',
      price: '$65',
      description: 'Delicate floral nail art',
      image: require('../assets/service2.jpg'),
    },
    {
      id: 3,
      name: 'Geometric Pattern',
      price: '$55',
      description: 'Modern geometric patterns',
      image: require('../assets/service3.jpg'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image
          source={require('../assets/salon-hero.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Welcome to Connie's Nail</Text>
          <Text style={styles.heroSubtitle}>
            Professional Nail Care & Beauty Services
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Booking')}
            style={styles.heroButton}
            contentStyle={styles.heroButtonContent}
          >
            Book Appointment Now
          </Button>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => navigation.navigate('Booking')}
        >
          <Icon name="calendar-today" size={30} color="#16a34a" />
          <Text style={styles.quickActionText}>Book Now</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => navigation.navigate('Services')}
        >
          <Icon name="spa" size={30} color="#16a34a" />
          <Text style={styles.quickActionText}>Services</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => navigation.navigate('Admin')}
        >
          <Icon name="admin-panel-settings" size={30} color="#16a34a" />
          <Text style={styles.quickActionText}>Admin</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Services</Text>
        {services.map((service) => (
          <Card key={service.id} style={styles.serviceCard}>
            <Card.Cover source={service.image} style={styles.serviceImage} />
            <Card.Content>
              <Title style={styles.serviceTitle}>{service.name}</Title>
              <Paragraph style={styles.serviceDescription}>
                {service.description}
              </Paragraph>
              <View style={styles.servicePriceRow}>
                <Text style={styles.servicePrice}>{service.price}</Text>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Booking', { serviceId: service.id })}
                  compact
                >
                  Book Now
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* AI Nail Art Section */}
      <View style={styles.section}>
        <Card style={styles.aiCard}>
          <Card.Content>
            <Title style={styles.aiTitle}>🤖 AI Nail Art Generator</Title>
            <Paragraph style={styles.aiDescription}>
              Upload your nail photos and let AI create custom designs for you!
            </Paragraph>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Services')}
              style={styles.aiButton}
            >
              Try AI Design
            </Button>
          </Card.Content>
        </Card>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact & Location</Text>
        <Card style={styles.contactCard}>
          <Card.Content>
            <View style={styles.contactRow}>
              <Icon name="phone" size={20} color="#16a34a" />
              <Text style={styles.contactText}>+82 10-9636-3833</Text>
            </View>
            <View style={styles.contactRow}>
              <Icon name="location-on" size={20} color="#16a34a" />
              <Text style={styles.contactText}>Seoul, South Korea</Text>
            </View>
            <View style={styles.contactRow}>
              <Icon name="access-time" size={20} color="#16a34a" />
              <Text style={styles.contactText}>Mon-Fri: 10AM-7PM</Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  heroSection: {
    position: 'relative',
    height: 250,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: '#16a34a',
  },
  heroButtonContent: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: 'white',
    marginTop: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  quickActionCard: {
    alignItems: 'center',
    padding: 15,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  serviceCard: {
    marginBottom: 15,
    elevation: 2,
  },
  serviceImage: {
    height: 120,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  servicePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  aiCard: {
    backgroundColor: '#f0f9ff',
    elevation: 2,
  },
  aiTitle: {
    color: '#16a34a',
    fontSize: 20,
  },
  aiDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  aiButton: {
    backgroundColor: '#16a34a',
  },
  contactCard: {
    elevation: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default HomeScreen;