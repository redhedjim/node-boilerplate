
exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.createTable('items', function(table){
          table.increments('id').primary();
          table.string('name');
          table.string('rfid');
          table.string('description');
          table.timestamps();
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.dropTable('items')
  ]);
};
