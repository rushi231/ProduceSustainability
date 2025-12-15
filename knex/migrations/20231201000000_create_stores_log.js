/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('stores_log', function(table) {
    table.increments('id').unsigned().primary();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('store_name').notNullable();
    table.string('store_location').notNullable();
    table.string('item_name').notNullable();
    table.integer('quantity_sold').notNullable().defaultTo(0);
    table.decimal('sold_price_per_unit', 10, 2).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('stores_log');
};
