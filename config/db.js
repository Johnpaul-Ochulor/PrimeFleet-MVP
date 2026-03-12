// import { PrismaClient } from '@prisma/client'
// import { PrismaPg } from '@prisma/adapter-pg'
// import pg from 'pg'
// import 'dotenv/config'

// const connectionString = process.env.DATABASE_URL

// const pool = new pg.Pool({ connectionString })
// const adapter = new PrismaPg(pool)

// // This is the single instance your whole app will use
// export const prisma = new PrismaClient({ adapter })


// config/db.js
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000, // Keep idle connections open for 30s
  connectionTimeoutMillis: 5000 // Give it 5s to establish a connection
})

const adapter = new PrismaPg(pool)


export const prisma = new PrismaClient({ adapter })
