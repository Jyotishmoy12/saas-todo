// Import the PrismaClient class from Prisma's client library
// This is the main class we'll use to interact with our database
import { PrismaClient } from '@prisma/client'

// Define a function that creates a new PrismaClient instance
// We use this function to ensure we only create a client when needed
const prismaClientSinglton = () => {
    return new PrismaClient()
}

// Define a type that represents the return type of our singleton function
// This helps TypeScript understand what type our prisma client will be
type prismaClientSinglton = ReturnType<typeof prismaClientSinglton>

// Create a modified global object type that can store our Prisma instance
// This is necessary because Next.js has hot reloading which can create multiple instances
// - globalThis refers to the global scope in Node.js
// - 'as unknown as' is used for type assertion
// - {prisma: PrismaClient | undefined} defines the shape we want to add to global
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Create our Prisma client instance using the nullish coalescing operator (??)
// - If globalForPrisma.prisma exists, use that
// - If it doesn't exist, create a new instance using prismaClientSinglton()
// This ensures we only have one Prisma instance throughout our application
const prisma = globalForPrisma.prisma ?? prismaClientSinglton()

// Export the prisma instance as the default export
// This allows other files to import and use this single instance
export default prisma

// Only store the prisma instance on the global object in development
// This prevents duplicate instances during hot reloading in development
// process.env.NODE_ENV will be "production" in production environment
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma