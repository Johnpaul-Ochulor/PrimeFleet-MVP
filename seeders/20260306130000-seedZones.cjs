'use strict';

// ============================================================
// PRIMEFLEET MVP — ZONE-BASED QUOTE ENGINE
// Sequelize Seed File: seedZones.js
//
// HOW TO RUN:
//   npx sequelize-cli db:seed:all
//
// HOW TO UNDO (wipes zone data and starts fresh):
//   npx sequelize-cli db:seed:undo:all
//
// REQUIREMENTS:
//   - Make sure your database is connected and running
//   - Make sure the Zone and ZoneRate tables already exist
//     (migrations must have been run first)
//   - Run this seed only ONCE. Running it twice will skip
//     duplicates safely due to "ignoreDuplicates: true"
// ============================================================

const { v4: uuidv4 } = require('uuid');

// ============================================================
// ZONE DEFINITIONS
// Each zone has a unique id generated upfront so we can
// reference them when building the ZoneRate combinations
// ============================================================

const ZONES = [
  // ── Island Core (Cluster A) ─────────────────────────────
  { name: 'Ikoyi',            cluster: 'A' },
  { name: 'Victoria Island',  cluster: 'A' },
  { name: 'Oniru',            cluster: 'A' },
  { name: 'Lagos Island',     cluster: 'A' },
  { name: 'Lekki Phase 1',    cluster: 'A' },

  // ── Mid-Lekki (Cluster B) ───────────────────────────────
  { name: 'Agungi',           cluster: 'B' },
  { name: 'Chevron',          cluster: 'B' },
  { name: 'Igbo Efon',        cluster: 'B' },
  { name: 'Osapa London',     cluster: 'B' },
  { name: 'Ajah',             cluster: 'B' },

  // ── Far Lekki / Epe Axis (Cluster C) ───────────────────
  { name: 'Sangotedo',        cluster: 'C' },
  { name: 'Awoyaya',          cluster: 'C' },
  { name: 'Lakowe',           cluster: 'C' },
  { name: 'Ibeju-Lekki',     cluster: 'C' },

  // ── Mainland Central (Cluster D) ───────────────────────
  { name: 'Ikeja',            cluster: 'D' },
  { name: 'Maryland',         cluster: 'D' },
  { name: 'Oregun',           cluster: 'D' },
  { name: 'Omole',            cluster: 'D' },
  { name: 'Magodo',           cluster: 'D' },
  { name: 'GRA',              cluster: 'D' },
  { name: 'Oshodi',           cluster: 'D' },
  { name: 'Gbagada',          cluster: 'D' },
  { name: 'Yaba',             cluster: 'D' },
  { name: 'Surulere',         cluster: 'D' },
  { name: 'Anthony',          cluster: 'D' },
  { name: 'Ilupeju',         cluster: 'D' },
  { name: 'Alausa',           cluster: 'D' },

  // ── Outer Mainland (Cluster E) ──────────────────────────
  { name: 'Berger',           cluster: 'E' },
  { name: 'Ojodu',            cluster: 'E' },
  { name: 'Isheri',           cluster: 'E' },
  { name: 'Agege',            cluster: 'E' },
  { name: 'Ogba',             cluster: 'E' },

  // ── Far Outskirts (Cluster F) ───────────────────────────
  { name: 'Festac',           cluster: 'F' },
  { name: 'Amuwo-Odofin',     cluster: 'F' },
  { name: 'Okota',            cluster: 'F' },
  { name: 'Isolo',            cluster: 'F' },
  { name: 'Ejigbo',           cluster: 'F' },

  // ── Very Far / Extreme Distance (Cluster G) ─────────────
  { name: 'Ikorodu',          cluster: 'G' },
  { name: 'Badagry',          cluster: 'G' },
  { name: 'Epe',              cluster: 'G' },
  { name: 'Alagbado',         cluster: 'G' },
  { name: 'Iba/LASU',         cluster: 'G' },
];

// ============================================================
// BASE PRICES (Medium distance default per vehicle type)
// ============================================================
const BASE_PRICES = {
  SEDAN: 18000,
  SUV:   27000,
  VAN:   38000,
  BUS:   60000,
};

const VEHICLE_TYPES = ['SEDAN', 'SUV', 'VAN', 'BUS'];

// ============================================================
// PRICING MULTIPLIERS
// These are applied based on the cluster combination
// of the pickup and dropoff zones
// ============================================================
const MULTIPLIERS = {
  SHORT:     0.60,  // Same or immediately adjacent cluster
  MEDIUM:    1.00,  // Default — cross-area but not extreme
  LONG:      1.70,  // Cross-axis (Island ↔ Mainland)
  VERY_LONG: 2.40,  // Extreme distance routes
};

// ============================================================
// ROUTE CLASSIFICATION LOGIC
// Given two cluster codes, determine the price tier
// ============================================================
function classifyRoute(clusterA, clusterB) {
  // Same cluster → always short
  if (clusterA === clusterB) return 'SHORT';

  const pair = [clusterA, clusterB].sort().join('-');

  // SHORT pairs — adjacent clusters, easy drives
  const shortPairs = [
    'A-B', // Island Core ↔ Mid-Lekki
    'B-C', // Mid-Lekki ↔ Far Lekki
    'D-E', // Mainland Central ↔ Outer Mainland
  ];
  if (shortPairs.includes(pair)) return 'SHORT';

  // VERY LONG — anything involving Cluster G (extreme zones)
  if (clusterA === 'G' || clusterB === 'G') return 'VERY_LONG';

  // LONG — cross-axis routes (Island to Mainland and vice versa)
  const longPairs = [
    'A-D', 'A-E', 'A-F', // Island Core ↔ any Mainland
    'B-D', 'B-E', 'B-F', // Mid-Lekki ↔ any Mainland
    'C-D', 'C-E', 'C-F', // Far Lekki ↔ any Mainland
  ];
  if (longPairs.includes(pair)) return 'LONG';

  // Everything else → MEDIUM (default)
  return 'MEDIUM';
}

// ============================================================
// SPOT CORRECTIONS
// Fine-tune specific zone pairs that the cluster logic
// does not handle perfectly
// Returns a custom multiplier override, or null if no override
// ============================================================
function spotCorrection(fromName, toName) {
  const pair = [fromName, toName].sort().join('|');

  const corrections = {
    // Ibeju-Lekki ↔ Epe — neighbours on same axis, reduce
    'Epe|Ibeju-Lekki':              0.65,

    // Festac ↔ Badagry — same south-west corridor, reduce
    'Badagry|Festac':               0.75,

    // Iba/LASU ↔ Festac/Amuwo — close south-west, reduce
    'Festac|Iba/LASU':              0.70,
    'Amuwo-Odofin|Iba/LASU':       0.70,

    // Alagbado ↔ close outer mainland neighbours, reduce
    'Agege|Alagbado':               0.70,
    'Alagbado|Ojodu':               0.70,
    'Alagbado|Berger':              0.70,
    'Alagbado|Isheri':              0.70,
  };

  return corrections[pair] || null;
}

// ============================================================
// ROUND to nearest 100 (cleaner prices for customers)
// ============================================================
function roundToHundred(value) {
  return Math.round(value / 100) * 100;
}

// ============================================================
// SEED FUNCTIONS
// ============================================================

module.exports = {

  // ----------------------------------------------------------
  // UP — runs when you execute: npx sequelize-cli db:seed:all
  // ----------------------------------------------------------
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // ── STEP 1: Assign UUIDs to all zones ──────────────────
    const zonesWithIds = ZONES.map(zone => ({
      ...zone,
      id:        uuidv4(),
      isActive:  true,
      createdAt: now,
      updatedAt: now,
    }));

    // ── STEP 2: Insert all zones ────────────────────────────
    console.log(`\n[PrimeFleet Seed] Inserting ${zonesWithIds.length} zones...`);

    await queryInterface.bulkInsert(
      'Zones',
      zonesWithIds.map(({ id, name, isActive, createdAt, updatedAt }) => ({
        id, name, isActive, createdAt, updatedAt
      })),
      { ignoreDuplicates: true }
    );

    console.log('[PrimeFleet Seed] Zones inserted successfully.');

    // ── STEP 3: Build a lookup map { zoneName → zone object }
    const zoneMap = {};
    zonesWithIds.forEach(z => { zoneMap[z.name] = z; });

    // ── STEP 4: Generate all ZoneRate combinations ──────────
    console.log('[PrimeFleet Seed] Generating zone rate combinations...');

    const zoneRates = [];

    for (const fromZone of zonesWithIds) {
      for (const toZone of zonesWithIds) {

        // Skip same-zone routes
        if (fromZone.id === toZone.id) continue;

        for (const vehicleType of VEHICLE_TYPES) {

          const basePrice = BASE_PRICES[vehicleType];

          // Check for a spot correction override first
          const correctionMultiplier = spotCorrection(fromZone.name, toZone.name);

          let finalPrice;

          if (correctionMultiplier !== null) {
            // Apply spot correction directly to base price
            finalPrice = roundToHundred(basePrice * correctionMultiplier);
          } else {
            // Use cluster-based classification
            const tier       = classifyRoute(fromZone.cluster, toZone.cluster);
            const multiplier = MULTIPLIERS[tier];
            finalPrice       = roundToHundred(basePrice * multiplier);
          }

          zoneRates.push({
            id:          uuidv4(),
            fromZoneId:  fromZone.id,
            toZoneId:    toZone.id,
            vehicleType,
            basePrice:   finalPrice,
            createdAt:   now,
            updatedAt:   now,
          });
        }
      }
    }

    console.log(`[PrimeFleet Seed] ${zoneRates.length} zone rate rows generated.`);

    // ── STEP 5: Insert ZoneRates in batches of 500 ─────────
    // (Inserting thousands of rows at once can time out —
    //  batching keeps it safe and fast)

    const BATCH_SIZE = 500;
    let inserted = 0;

    for (let i = 0; i < zoneRates.length; i += BATCH_SIZE) {
      const batch = zoneRates.slice(i, i + BATCH_SIZE);
      await queryInterface.bulkInsert('ZoneRates', batch, {
        ignoreDuplicates: true,
      });
      inserted += batch.length;
      console.log(`[PrimeFleet Seed] Inserted ${inserted} / ${zoneRates.length} zone rates...`);
    }

    console.log('[PrimeFleet Seed] ✅ All zone rates inserted successfully.');
    console.log(`[PrimeFleet Seed] Summary:`);
    console.log(`  • Zones:      ${zonesWithIds.length}`);
    console.log(`  • Zone Rates: ${zoneRates.length}`);
    console.log(`  • Vehicle Types: ${VEHICLE_TYPES.join(', ')}`);
  },


  // ----------------------------------------------------------
  // DOWN — runs when you execute: npx sequelize-cli db:seed:undo:all
  // Wipes all seeded data so you can start fresh
  // ----------------------------------------------------------
  async down(queryInterface, Sequelize) {
    console.log('\n[PrimeFleet Seed] Reversing seed — deleting zone rates and zones...');

    await queryInterface.bulkDelete('ZoneRates', null, {});
    await queryInterface.bulkDelete('Zones',     null, {});

    console.log('[PrimeFleet Seed] ✅ Seed reversed successfully.');
  },

};
