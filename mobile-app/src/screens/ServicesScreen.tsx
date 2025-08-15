import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Card, Button, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ServicesScreenProps {
  navigation: any;
}

const ServicesScreen: React.FC<ServicesScreenProps> = ({ navigation }) => {
  const services = [
    {
      id: 1,
      name: 'Classic French Manicure',
      price: 45,
      duration: '60 min',
      description: 'Traditional French manicure with elegant white tips and clear base',
      category: 'Classic',
      image: require('../assets/french-manicure.jpg'),
      features: ['Base prep', 'Cuticle care', 'French tips', 'Top coat'],
    },
    {
      id: 2,
      name: 'Floral Design',
      price: 65,
      duration: '90 min',
      description: 'Delicate hand-painted floral patterns with seasonal flowers',
      category: 'Artistic',
      image: require('../assets/floral-design.jpg'),
      features: ['Custom design', 'Hand painting', 'Floral motifs', 'Premium colors'],
    },
    {
      id: 3,
      name: 'Geometric Pattern',
      price: 55,
      duration: '75 min',
      description: 'Modern geometric patterns with clean lines and bold shapes',
      category: 'Modern',
      image: require('../assets/geometric.jpg'),
      features: ['Precise lines', 'Bold patterns', 'Modern style', 'Color blocking'],
    },
    {
      id: 4,
      name: 'Glitter & Sparkle',
      price: 70,
      duration: '80 min',
      description: 'Glamorous glitter application with premium sparkle finishes',
      category: 'Glamour',
      image: require('../assets/glitter.jpg'),
      features: ['Premium glitter', 'Sparkle finish', 'Glamorous look', 'Long-lasting'],
    },
    {
      id: 5,
      name: 'Minimalist Style',
      price: 40,
      duration: '45 min',
      description: 'Simple and sophisticated minimal design for everyday elegance',
      category: 'Minimal',
      image: require('../assets/minimalist.jpg'),
      features: ['Clean look', 'Subtle colors', 'Professional', 'Quick service'],
    },
    {
      id: 6,
      name: 'Seasonal Design',
      price: 60,
      duration: '85 min',
      description: 'Special seasonal designs reflecting current trends and holidays',
      category: 'Seasonal',
      image: require('../assets/seasonal.jpg'),
      features: ['Seasonal themes', 'Holiday specials', 'Trending colors', 'Limited time'],
    },
    {
      id: 7,
      name: 'Wedding Special',
      price: 80,
      duration: '120 min',
      description: 'Elegant bridal nail art perfect for your special day',
      category: 'Bridal',
      image: require('../assets/wedding.jpg'),
      features: ['Bridal consultation', 'Premium service', 'Photo-ready', 'Long-lasting'],
    },
    {
      id: 8,
      name: 'Ombre Effect',
      price: 65,
      duration: '90 min',
      description: 'Beautiful gradient effects with smooth color transitions',
      category: 'Artistic',
      image: require('../assets/ombre.jpg'),
      features: ['Gradient effect', 'Color blending', 'Smooth finish', 'Instagram-worthy'],
    },
    {
      id: 9,
      name: '3D Art Design',
      price: 90,
      duration: '150 min',
      description: 'Three-dimensional nail art with sculptured elements and textures',
      category: 'Premium',
      image: require('../assets/3d-art.jpg'),
      features: ['3D elements', 'Sculptured art', 'Premium materials', 'Show-stopping'],
    },
  ];

  const categories = ['All', 'Classic', 'Artistic', 'Modern', 'Glamour', 'Minimal', 'Seasonal', 'Bridal', 'Premium'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Classic: '#8b5a2b',
      Artistic: '#e91e63',
      Modern: '#673ab7',
      Glamour: '#ff9800',
      Minimal: '#607d8b',
      Seasonal: '#4caf50',
      Bridal: '#f8bbd9',
      Premium: '#b8860b',
    };
    return colors[category] || '#16a34a';
  };

  return (
    <View style={styles.container}>
      {/* AI Banner */}
      <Card style={styles.aiBanner}>
        <Card.Content>
          <View style={styles.aiHeader}>
            <Icon name="auto-fix-high" size={24} color="#16a34a" />
            <Text style={styles.aiTitle}>🤖 AI Nail Art Generator</Text>
          </View>
          <Text style={styles.aiDescription}>
            Upload your nail photos and let AI create custom designs just for you!
          </Text>
          <Button
            mode="contained"
            onPress={() => {/* Navigate to AI feature */}}
            style={styles.aiButton}
            compact
          >
            Try AI Design
          </Button>
        </Card.Content>
      </Card>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <Chip
            key={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.selectedCategoryChip,
            ]}
            textStyle={[
              styles.categoryChipText,
              selectedCategory === category && styles.selectedCategoryChipText,
            ]}
          >
            {category}
          </Chip>
        ))}
      </ScrollView>

      {/* Services List */}
      <ScrollView style={styles.servicesList}>
        {filteredServices.map((service) => (
          <Card key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <Image source={service.image} style={styles.serviceImage} />
              <View style={styles.serviceInfo}>
                <View style={styles.serviceTitleRow}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Chip
                    style={[styles.categoryBadge, { backgroundColor: getCategoryColor(service.category) }]}
                    textStyle={styles.categoryBadgeText}
                  >
                    {service.category}
                  </Chip>
                </View>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                
                <View style={styles.serviceDetails}>
                  <View style={styles.priceAndDuration}>
                    <Text style={styles.servicePrice}>${service.price}</Text>
                    <View style={styles.durationContainer}>
                      <Icon name="access-time" size={16} color="#666" />
                      <Text style={styles.serviceDuration}>{service.duration}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            
            <Card.Content>
              <Text style={styles.featuresTitle}>What's Included:</Text>
              <View style={styles.featuresList}>
                {service.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Icon name="check-circle" size={16} color="#16a34a" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.actionButtons}>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Booking', { serviceId: service.id })}
                  style={styles.bookButton}
                >
                  Book Now
                </Button>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('Booking', { 
                    serviceId: service.id,
                    withPayment: true 
                  })}
                  style={styles.payButton}
                >
                  Book & Pay (10% Off)
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  aiBanner: {
    margin: 16,
    backgroundColor: '#f0f9ff',
    elevation: 2,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#16a34a',
  },
  aiDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  aiButton: {
    backgroundColor: '#16a34a',
    alignSelf: 'flex-start',
  },
  categoryScroll: {
    maxHeight: 60,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: '#f8f8f8',
  },
  selectedCategoryChip: {
    backgroundColor: '#16a34a',
  },
  categoryChipText: {
    color: '#666',
  },
  selectedCategoryChipText: {
    color: 'white',
  },
  servicesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  serviceCard: {
    marginBottom: 16,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
  },
  serviceImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 8,
  },
  serviceInfo: {
    flex: 1,
    padding: 16,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    height: 24,
  },
  categoryBadgeText: {
    color: 'white',
    fontSize: 12,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  serviceDetails: {
    marginTop: 'auto',
  },
  priceAndDuration: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDuration: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  featuresList: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookButton: {
    flex: 0.45,
    borderColor: '#16a34a',
  },
  payButton: {
    flex: 0.45,
    backgroundColor: '#16a34a',
  },
});

export default ServicesScreen;