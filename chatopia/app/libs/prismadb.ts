import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined;
}

// Ensuring there is only a single instance of Prisma Client running
const prisma = global.prisma ?? new PrismaClient();
export default prisma;

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;




// EDGE-COMPATIBLE PRISMA ADAPTER BELOW

// import { PrismaNeon } from '@prisma/adapter-neon';
// import { Pool , neonConfig} from '@neondatabase/serverless';
// import { PrismaClient } from '@prisma/client'

// import dotenv from 'dotenv';
// import ws from 'ws';



// const prismaClientSingleton = () => {
  // dotenv.config();
  // neonConfig.webSocketConstructor = ws;
  // const connectionString = `${process.env.POSTGRES_PRISMA_URL}`;
  // const pool =  new Pool({connectionString});
  // const adapter = new PrismaNeon( pool );
  // return new PrismaClient({ adapter });
//   return new PrismaClient();
// }

// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// } & typeof global;

// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// export default prisma

// if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma