
exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.createTable('user', function(table){
          table.increments('id').primary();
          table.string('password_digest');
          table.string('first');
          table.string('last');
          table.string('email').notNullable().unique();
          table.boolean('admin');
          table.boolean('inactive');
          table.timestamps();
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.dropTable('users')
  ])
};
