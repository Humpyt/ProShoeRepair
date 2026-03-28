import express from 'express';
import db from '../database';

const router = express.Router();

// Helper to get date boundaries
const getDateBoundaries = () => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
  return { now, startOfToday, endOfToday, startOfWeek, startOfMonth, endOfMonth };
};

// GET /api/analytics/discounts - Returns discount analytics
router.get('/discounts', async (req, res) => {
  try {
    const { startOfMonth, endOfMonth } = getDateBoundaries();

    // Get summary statistics
    const summaryResult = await db.prepare(`
      SELECT
        COUNT(*) as totalOperations,
        COALESCE(SUM(discount), 0) as totalDiscounts,
        COALESCE(AVG(CASE WHEN discount > 0 THEN (discount / NULLIF(total_amount, 0)) * 100 ELSE 0 END), 0) as averageDiscountPercent,
        COUNT(CASE WHEN discount > 0 THEN 1 END) as operationsWithDiscount
      FROM operations
      WHERE discount > 0
    `).get() as any;

    const totalOperationsWithDiscount = summaryResult.operationsWithDiscount || 0;
    const totalDiscounts = summaryResult.totalDiscounts || 0;
    const averageDiscountPercent = summaryResult.averageDiscountPercent || 0;

    // Get discounts by period (last 30 days)
    const byPeriodResult = await db.prepare(`
      SELECT
        DATE(created_at) as date,
        SUM(discount) as total,
        COUNT(*) as count
      FROM operations
      WHERE discount > 0
        AND created_at >= DATE('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `).all() as any[];

    const byPeriod = byPeriodResult.map(row => ({
      date: row.date,
      total: row.total,
      count: row.count
    }));

    // Get top discounted operations
    const topDiscountedResult = await db.prepare(`
      SELECT
        o.id,
        c.name as customerName,
        o.total_amount,
        o.discount,
        o.created_at as date
      FROM operations o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.discount > 0
      ORDER BY o.discount DESC
      LIMIT 10
    `).all() as any[];

    const topDiscounted = topDiscountedResult.map(row => ({
      id: row.id,
      customerName: row.customerName || 'Unknown',
      totalAmount: row.total_amount,
      discount: row.discount,
      date: row.date
    }));

    res.json({
      summary: {
        totalDiscounts,
        averageDiscountPercent: Math.round(averageDiscountPercent * 100) / 100,
        operationsWithDiscount: totalOperationsWithDiscount
      },
      byPeriod,
      topDiscounted
    });
  } catch (error) {
    console.error('Error fetching discount analytics:', error);
    res.status(500).json({ error: 'Failed to fetch discount analytics' });
  }
});

// GET /api/analytics/new-customers - Returns new customer analytics
router.get('/new-customers', async (req, res) => {
  try {
    const { startOfToday, endOfToday, startOfWeek, startOfMonth } = getDateBoundaries();

    // Get summary counts
    const totalResult = await db.prepare(`
      SELECT COUNT(*) as total FROM customers
    `).get() as any;

    const thisMonthResult = await db.prepare(`
      SELECT COUNT(*) as count FROM customers
      WHERE created_at >= ? AND created_at <= ?
    `).get(startOfMonth, endOfMonth) as any;

    const thisWeekResult = await db.prepare(`
      SELECT COUNT(*) as count FROM customers
      WHERE created_at >= ?
    `).get(startOfWeek) as any;

    const todayResult = await db.prepare(`
      SELECT COUNT(*) as count FROM customers
      WHERE created_at >= ? AND created_at <= ?
    `).get(startOfToday, endOfToday) as any;

    // Get trend (daily new customers for last 30 days)
    const trendResult = await db.prepare(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as count
      FROM customers
      WHERE created_at >= DATE('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `).all() as any[];

    const trend = trendResult.map(row => ({
      date: row.date,
      count: row.count
    }));

    // Get recent customers
    const recentCustomersResult = await db.prepare(`
      SELECT
        id,
        name,
        phone,
        created_at as createdAt,
        total_orders
      FROM customers
      ORDER BY created_at DESC
      LIMIT 10
    `).all() as any[];

    const recentCustomers = recentCustomersResult.map(row => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      createdAt: row.createdAt,
      totalOrders: row.total_orders
    }));

    res.json({
      summary: {
        total: totalResult.total || 0,
        thisMonth: thisMonthResult?.count || 0,
        thisWeek: thisWeekResult?.count || 0,
        today: todayResult?.count || 0
      },
      trend,
      recentCustomers
    });
  } catch (error) {
    console.error('Error fetching new customer analytics:', error);
    res.status(500).json({ error: 'Failed to fetch new customer analytics' });
  }
});

// GET /api/analytics/customer-rankings - Returns customer rankings by multiple metrics
router.get('/customer-rankings', async (req, res) => {
  try {
    // Get all customers ordered by total_spent
    const bySpentResult = await db.prepare(`
      SELECT
        id,
        name,
        phone,
        total_spent as totalSpent,
        total_orders as orderCount,
        last_visit as lastVisit
      FROM customers
      WHERE status = 'active'
      ORDER BY total_spent DESC
      LIMIT 20
    `).all() as any[];

    const bySpent = bySpentResult.map(row => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      totalSpent: row.totalSpent || 0,
      orderCount: row.orderCount || 0,
      lastVisit: row.lastVisit
    }));

    // Get all customers ordered by order count
    const byOrdersResult = await db.prepare(`
      SELECT
        id,
        name,
        phone,
        total_spent as totalSpent,
        total_orders as orderCount,
        last_visit as lastVisit
      FROM customers
      WHERE status = 'active'
      ORDER BY total_orders DESC
      LIMIT 20
    `).all() as any[];

    const byOrders = byOrdersResult.map(row => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      totalSpent: row.totalSpent || 0,
      orderCount: row.orderCount || 0,
      lastVisit: row.lastVisit
    }));

    // Get all customers ordered by loyalty points
    const byLoyaltyResult = await db.prepare(`
      SELECT
        id,
        name,
        phone,
        loyalty_points as loyaltyPoints,
        total_spent as totalSpent
      FROM customers
      WHERE status = 'active'
      ORDER BY loyalty_points DESC
      LIMIT 20
    `).all() as any[];

    const byLoyalty = byLoyaltyResult.map(row => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      loyaltyPoints: row.loyaltyPoints || 0,
      totalSpent: row.totalSpent || 0
    }));

    res.json({
      bySpent,
      byOrders,
      byLoyalty
    });
  } catch (error) {
    console.error('Error fetching customer rankings:', error);
    res.status(500).json({ error: 'Failed to fetch customer rankings' });
  }
});

// GET /api/analytics/service-performance - Returns service performance analytics
router.get('/service-performance', async (req, res) => {
  try {
    // Get service performance by revenue
    const byRevenueResult = await db.prepare(`
      SELECT
        s.id as serviceId,
        s.name as serviceName,
        s.category,
        COALESCE(SUM(os.price * os.quantity), 0) as totalRevenue,
        COUNT(DISTINCT os.operation_shoe_id) as orderCount
      FROM services s
      LEFT JOIN operation_services os ON s.id = os.service_id
      GROUP BY s.id, s.name, s.category
      ORDER BY totalRevenue DESC
    `).all() as any[];

    const byRevenue = byRevenueResult.map(row => ({
      serviceId: row.serviceId,
      serviceName: row.serviceName,
      category: row.category || 'Uncategorized',
      totalRevenue: row.totalRevenue || 0,
      orderCount: row.orderCount || 0
    }));

    // Get service performance by order count
    const byOrdersResult = await db.prepare(`
      SELECT
        s.id as serviceId,
        s.name as serviceName,
        s.category,
        COALESCE(SUM(os.price * os.quantity), 0) as totalRevenue,
        COUNT(DISTINCT os.operation_shoe_id) as orderCount
      FROM services s
      LEFT JOIN operation_services os ON s.id = os.service_id
      GROUP BY s.id, s.name, s.category
      ORDER BY orderCount DESC
    `).all() as any[];

    const byOrders = byOrdersResult.map(row => ({
      serviceId: row.serviceId,
      serviceName: row.serviceName,
      category: row.category || 'Uncategorized',
      totalRevenue: row.totalRevenue || 0,
      orderCount: row.orderCount || 0
    }));

    // Get category breakdown
    const categoryBreakdownResult = await db.prepare(`
      SELECT
        COALESCE(s.category, 'Uncategorized') as category,
        COALESCE(SUM(os.price * os.quantity), 0) as totalRevenue,
        COUNT(DISTINCT os.operation_shoe_id) as orderCount
      FROM services s
      LEFT JOIN operation_services os ON s.id = os.service_id
      GROUP BY s.category
      ORDER BY totalRevenue DESC
    `).all() as any[];

    const categoryBreakdown = categoryBreakdownResult.map(row => ({
      category: row.category || 'Uncategorized',
      totalRevenue: row.totalRevenue || 0,
      orderCount: row.orderCount || 0
    }));

    res.json({
      byRevenue,
      byOrders,
      categoryBreakdown
    });
  } catch (error) {
    console.error('Error fetching service performance:', error);
    res.status(500).json({ error: 'Failed to fetch service performance analytics' });
  }
});

// GET /api/analytics/unpaid-balances - Returns unpaid balance analytics
router.get('/unpaid-balances', async (req, res) => {
  try {
    const now = new Date();

    // Get summary statistics
    const summaryResult = await db.prepare(`
      SELECT
        COALESCE(SUM(total_amount - paid_amount), 0) as totalUnpaid,
        COUNT(CASE WHEN (total_amount - paid_amount) > 0 THEN 1 END) as partialPaymentCount,
        COUNT(CASE WHEN (total_amount - paid_amount) = total_amount
                   AND created_at < DATE('now', '-30 days') THEN 1 END) as overdueCount
      FROM operations
      WHERE total_amount > paid_amount
    `).get() as any;

    // Get aging analysis
    const agingResult = await db.prepare(`
      SELECT
        COUNT(CASE WHEN created_at >= DATE('now', '-30 days') THEN 1 END) as currentCount,
        COALESCE(SUM(CASE WHEN created_at >= DATE('now', '-30 days')
                          THEN total_amount - paid_amount ELSE 0 END), 0) as currentBalance,
        COUNT(CASE WHEN created_at >= DATE('now', '-60 days')
                   AND created_at < DATE('now', '-30 days') THEN 1 END) as aging30Count,
        COALESCE(SUM(CASE WHEN created_at >= DATE('now', '-60 days')
                          AND created_at < DATE('now', '-30 days')
                          THEN total_amount - paid_amount ELSE 0 END), 0) as aging30Balance,
        COUNT(CASE WHEN created_at >= DATE('now', '-90 days')
                   AND created_at < DATE('now', '-60 days') THEN 1 END) as aging60Count,
        COALESCE(SUM(CASE WHEN created_at >= DATE('now', '-90 days')
                          AND created_at < DATE('now', '-60 days')
                          THEN total_amount - paid_amount ELSE 0 END), 0) as aging60Balance,
        COUNT(CASE WHEN created_at < DATE('now', '-90 days') THEN 1 END) as overdueCount,
        COALESCE(SUM(CASE WHEN created_at < DATE('now', '-90 days')
                          THEN total_amount - paid_amount ELSE 0 END), 0) as overdueBalance
      FROM operations
      WHERE total_amount > paid_amount
    `).get() as any;

    const agingAnalysis = {
      current: {
        balance: agingResult.currentBalance || 0,
        count: agingResult.currentCount || 0
      },
      aging30: {
        balance: agingResult.aging30Balance || 0,
        count: agingResult.aging30Count || 0
      },
      aging60: {
        balance: agingResult.aging60Balance || 0,
        count: agingResult.aging60Count || 0
      },
      overdue: {
        balance: agingResult.overdueBalance || 0,
        count: agingResult.overdueCount || 0
      }
    };

    // Get unpaid operations
    const unpaidOperationsResult = await db.prepare(`
      SELECT
        o.id,
        o.customer_id as customerId,
        c.name as customerName,
        c.phone as customerPhone,
        o.total_amount,
        o.paid_amount,
        o.total_amount - o.paid_amount as balance,
        o.created_at as createdAt,
        o.created_at as createdAtRaw
      FROM operations o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.total_amount > o.paid_amount
      ORDER BY o.created_at ASC
      LIMIT 50
    `).all() as any[];

    const unpaidOperations = unpaidOperationsResult.map(row => {
      const createdAtDate = new Date(row.createdAtRaw);
      const daysOutstanding = Math.floor((now.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24));

      return {
        id: row.id,
        customerId: row.customerId || '',
        customerName: row.customerName || 'Unknown',
        customerPhone: row.customerPhone || '',
        totalAmount: row.total_amount,
        paidAmount: row.paid_amount,
        balance: row.balance,
        createdAt: row.createdAt,
        daysOutstanding
      };
    });

    res.json({
      summary: {
        totalUnpaid: summaryResult.totalUnpaid || 0,
        overdueCount: summaryResult.overdueCount || 0,
        partialPaymentCount: summaryResult.partialPaymentCount || 0
      },
      agingAnalysis,
      unpaidOperations
    });
  } catch (error) {
    console.error('Error fetching unpaid balances:', error);
    res.status(500).json({ error: 'Failed to fetch unpaid balance analytics' });
  }
});

export default router;
