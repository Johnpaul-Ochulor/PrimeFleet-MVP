'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. CREATE THE ZONES TABLE FIRST (The Parent)
    // We must do this first so ZoneRates has something to "point" to.
    await queryInterface.createTable('Zones', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 2. CREATE THE ZONERATES TABLE SECOND (The Child)
    await queryInterface.createTable('ZoneRates', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      fromZoneId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Zones', key: 'id' }, // This looks for the table created above
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      toZoneId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Zones', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      vehicleType: {
        type: Sequelize.ENUM('SEDAN', 'SUV', 'VAN', 'BUS'),
        allowNull: false,
      },
      basePrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 3. ADD THE UNIQUE CONSTRAINT
    await queryInterface.addConstraint('ZoneRates', {
      fields: ['fromZoneId', 'toZoneId', 'vehicleType'],
      type: 'unique',
      name: 'unique_zone_rate_route',
    });

    console.log('[Migration] ✅ Zones and ZoneRates tables created successfully.');
  },

  async down(queryInterface, Sequelize) {
    // Drop in reverse order (Child first, then Parent)
    await queryInterface.dropTable('ZoneRates');
    await queryInterface.dropTable('Zones');
    // Clean up the custom Enum type in Postgres
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_ZoneRates_vehicleType";');
  }
};