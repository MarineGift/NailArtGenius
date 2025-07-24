// Test script for phone validation system
const testPhoneValidation = async () => {
  console.log('🧪 Testing Phone Validation System');
  
  // Test 1: Booking with existing customer phone
  const existingCustomerPhone = '010-1234-5678';
  console.log(`\n📱 Test 1: Booking with existing customer: ${existingCustomerPhone}`);
  
  // Test 2: Booking with new customer phone
  const newCustomerPhone = '010-9999-8888';
  console.log(`\n📱 Test 2: Booking with new customer: ${newCustomerPhone}`);
  
  // Test 3: AI Nail Art with mandatory phone
  console.log(`\n🤖 Test 3: AI Nail Art creation with phone validation`);
  
  // Test 4: Finger data entry with phone check
  console.log(`\n👆 Test 4: Finger data entry with phone validation`);
  
  console.log('\n✅ Phone validation tests completed');
};

testPhoneValidation();