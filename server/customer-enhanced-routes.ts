import { Router } from 'express';
import { db } from './db';
import { 
  customers, 
  customerVisitHistory, 
  customerPreferences, 
  customerLoyalty, 
  customerSegments,
  bookings,
  orders
} from '@shared/schema';
import { eq, desc, sql, and, gte, lte, sum, count, avg } from 'drizzle-orm';

const router = Router();

// Get enhanced customer analytics
router.get('/api/customers/analytics', async (req, res) => {
  try {
    const [
      totalCustomersResult,
      vipCustomersResult,
      avgLifetimeValueResult,
      activeThisMonthResult
    ] = await Promise.all([
      db.select({ count: count() }).from(customers),
      db.select({ count: count() }).from(customers).where(sql`vip_level != 'regular'`),
      db.select({ avg: avg(customers.lifetimeValue) }).from(customers),
      db.select({ count: count() })
        .from(customers)
        .where(gte(customers.lastVisit, sql`date_trunc('month', current_date)`))
    ]);

    const analytics = {
      totalCustomers: totalCustomersResult[0]?.count || 0,
      vipCustomers: vipCustomersResult[0]?.count || 0,
      avgLifetimeValue: parseFloat(avgLifetimeValueResult[0]?.avg || '0').toFixed(2),
      activeThisMonth: activeThisMonthResult[0]?.count || 0
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get enhanced customers with additional fields
router.get('/api/customers/enhanced', async (req, res) => {
  try {
    const enhancedCustomers = await db
      .select({
        id: customers.id,
        name: customers.name,
        phoneNumber: customers.phoneNumber,
        email: customers.email,
        category: customers.category,
        vipLevel: customers.vipLevel,
        loyaltyPoints: customers.loyaltyPoints,
        totalVisits: customers.totalVisits,
        totalSpent: customers.totalSpent,
        lastVisit: customers.lastVisit,
        birthday: customers.birthday,
        preferredServices: customers.preferredServices,
        customerRating: customers.customerRating,
        lifetimeValue: customers.lifetimeValue,
        createdAt: customers.createdAt
      })
      .from(customers)
      .orderBy(desc(customers.updatedAt));

    res.json(enhancedCustomers);
  } catch (error) {
    console.error('Error fetching enhanced customers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get detailed customer profile
router.get('/api/customers/profile/:id', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id);
    
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId));

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Get visit history
    const visitHistory = await db
      .select()
      .from(customerVisitHistory)
      .where(eq(customerVisitHistory.customerId, customerId))
      .orderBy(desc(customerVisitHistory.visitDate))
      .limit(10);

    // Get preferences
    const [preferences] = await db
      .select()
      .from(customerPreferences)
      .where(eq(customerPreferences.customerId, customerId));

    // Get loyalty info
    const [loyaltyInfo] = await db
      .select()
      .from(customerLoyalty)
      .where(eq(customerLoyalty.customerId, customerId));

    const profile = {
      customer,
      visitHistory,
      preferences: preferences || null,
      loyaltyInfo: loyaltyInfo || null
    };

    res.json(profile);
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update customer VIP level
router.patch('/api/customers/:id/vip-level', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id);
    const { vipLevel } = req.body;

    if (!['regular', 'silver', 'gold', 'platinum', 'diamond'].includes(vipLevel)) {
      return res.status(400).json({ message: 'Invalid VIP level' });
    }

    await db
      .update(customers)
      .set({ 
        vipLevel,
        updatedAt: sql`now()`
      })
      .where(eq(customers.id, customerId));

    res.json({ message: 'VIP level updated successfully' });
  } catch (error) {
    console.error('Error updating VIP level:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add loyalty points
router.post('/api/customers/:id/loyalty-points', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id);
    const { points, reason } = req.body;

    // Update customer loyalty points
    await db
      .update(customers)
      .set({ 
        loyaltyPoints: sql`loyalty_points + ${points}`,
        updatedAt: sql`now()`
      })
      .where(eq(customers.id, customerId));

    // Update or create loyalty record
    const [existingLoyalty] = await db
      .select()
      .from(customerLoyalty)
      .where(eq(customerLoyalty.customerId, customerId));

    if (existingLoyalty) {
      await db
        .update(customerLoyalty)
        .set({
          currentPoints: sql`current_points + ${points}`,
          totalPointsEarned: sql`total_points_earned + ${points}`,
          lastPointsActivity: sql`now()`,
          updatedAt: sql`now()`
        })
        .where(eq(customerLoyalty.customerId, customerId));
    } else {
      await db
        .insert(customerLoyalty)
        .values({
          customerId,
          currentPoints: points,
          totalPointsEarned: points,
          lastPointsActivity: sql`now()`
        });
    }

    res.json({ message: 'Loyalty points added successfully' });
  } catch (error) {
    console.error('Error adding loyalty points:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create customer visit history entry
router.post('/api/customers/:id/visit-history', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id);
    const visitData = req.body;

    const newVisit = await db
      .insert(customerVisitHistory)
      .values({
        customerId,
        ...visitData,
        visitDate: new Date(),
      })
      .returning();

    // Update customer totals
    await db
      .update(customers)
      .set({
        totalVisits: sql`total_visits + 1`,
        totalSpent: sql`total_spent + ${visitData.totalAmount}`,
        lastVisit: sql`now()`,
        lifetimeValue: sql`lifetime_value + ${visitData.totalAmount}`,
        updatedAt: sql`now()`
      })
      .where(eq(customers.id, customerId));

    res.json(newVisit[0]);
  } catch (error) {
    console.error('Error creating visit history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update customer preferences
router.put('/api/customers/:id/preferences', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id);
    const preferencesData = req.body;

    const [existingPreferences] = await db
      .select()
      .from(customerPreferences)
      .where(eq(customerPreferences.customerId, customerId));

    if (existingPreferences) {
      await db
        .update(customerPreferences)
        .set({
          ...preferencesData,
          updatedAt: sql`now()`
        })
        .where(eq(customerPreferences.customerId, customerId));
    } else {
      await db
        .insert(customerPreferences)
        .values({
          customerId,
          ...preferencesData
        });
    }

    res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create customer segment
router.post('/api/customers/segments', async (req, res) => {
  try {
    const { segmentName, description, criteria } = req.body;

    // Create segment
    const newSegment = await db
      .insert(customerSegments)
      .values({
        segmentName,
        description,
        criteria,
        createdBy: 'admin' // TODO: get from auth
      })
      .returning();

    res.json(newSegment[0]);
  } catch (error) {
    console.error('Error creating customer segment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get customer segments
router.get('/api/customers/segments', async (req, res) => {
  try {
    const segments = await db
      .select()
      .from(customerSegments)
      .where(eq(customerSegments.isActive, true))
      .orderBy(desc(customerSegments.createdAt));

    res.json(segments);
  } catch (error) {
    console.error('Error fetching customer segments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get customer retention metrics
router.get('/api/customers/retention', async (req, res) => {
  try {
    // Calculate retention metrics
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalCustomers,
      recentCustomers,
      repeatCustomers
    ] = await Promise.all([
      db.select({ count: count() }).from(customers),
      db.select({ count: count() })
        .from(customers)
        .where(gte(customers.createdAt, thirtyDaysAgo)),
      db.select({ count: count() })
        .from(customers)
        .where(sql`total_visits > 1`)
    ]);

    const retentionRate = totalCustomers[0]?.count > 0 
      ? ((repeatCustomers[0]?.count || 0) / (totalCustomers[0]?.count || 1) * 100).toFixed(2)
      : '0.00';

    const metrics = {
      totalCustomers: totalCustomers[0]?.count || 0,
      recentCustomers: recentCustomers[0]?.count || 0,
      repeatCustomers: repeatCustomers[0]?.count || 0,
      retentionRate: parseFloat(retentionRate)
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching retention metrics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as customerEnhancedRoutes };