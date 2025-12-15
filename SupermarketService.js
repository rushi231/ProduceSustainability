const knex = require("./db");

const SupermarketService = {
  
  /**
   * Save store sales data to database
   */
  saveStoresData: async (storeName, storeLocation, itemName, quantitySold, itemPriceSold) => {
    try {
      await knex('stores_log').insert({
        store_name: storeName,
        store_location: storeLocation,
        item_name: itemName,
        quantity_sold: quantitySold,
        sold_price_per_unit: itemPriceSold
      });
      return { success: true };
    } catch (error) {
      console.error('Error saving store data:', error);
      throw error;
    }
  },
    
  /**
   * Get weekly average price for all products
   */
  getWeeklyAverageAllProducts: async (storeName, daysBack = 7, location) => {
    try {
      const preTimeLimit = new Date();
      preTimeLimit.setDate(preTimeLimit.getDate() - daysBack);

      const query = await knex('stores_log')
        .select(
          'store_name', 
          knex.raw('MIN(created_at) AS created_at'), 
          'item_name', 
          'store_location', 
          knex.raw('AVG(sold_price_per_unit) AS average_price_per_unit'),
          knex.raw('AVG(quantity_sold) AS average_quantity_sold'))
        .where('created_at', '>=', preTimeLimit)
        .where('store_name', '=', storeName)
        .where('store_location', '=', location)
        .groupBy('store_name', 'store_location', 'item_name');

      return query;
    } catch (error) {
      console.error('Error getting weekly averages:', error);
      throw error;
    }
  },

  /**
   * Get weekly total sales for all products
   */
  getWeeklyTotalAllProducts: async (storeName, daysBack = 7, location) => {
    try {
      const preTimeLimit = new Date();
      preTimeLimit.setDate(preTimeLimit.getDate() - daysBack);

      const query = await knex('stores_log')
        .select(
          'store_name', 
          knex.raw('MIN(created_at) AS created_at'), 
          'item_name', 
          'store_location', 
          knex.raw('SUM(quantity_sold) AS total_quantity_sold'),
          knex.raw('SUM(sold_price_per_unit * quantity_sold) AS total_revenue'))
        .where('created_at', '>=', preTimeLimit)
        .where('store_name', '=', storeName)
        .where('store_location', '=', location)
        .groupBy('store_name', 'store_location', 'item_name');

      return query;
    } catch (error) {
      console.error('Error getting weekly totals:', error);
      throw error;
    }
  },

  /**
   * Get all sales history for a specific item (for ML training)
   */
  getItemSalesHistory: async (storeName, storeLocation, itemName) => {
    try {
      const query = await knex('stores_log')
        .select('created_at', 'quantity_sold', 'sold_price_per_unit')
        .where('store_name', '=', storeName)
        .where('store_location', '=', storeLocation)
        .where('item_name', '=', itemName)
        .orderBy('created_at', 'asc');

      return query;
    } catch (error) {
      console.error('Error getting item sales history:', error);
      throw error;
    }
  }
};

module.exports = SupermarketService;
