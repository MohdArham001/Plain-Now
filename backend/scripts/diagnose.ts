
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("1. Testing Database Connection...");
    try {
        await prisma.$connect();
        console.log("✅ Connection Successful.");
    } catch (e) {
        console.error("❌ Connection Failed:", e);
        process.exit(1);
    }

    console.log("2. Checking User Model Schema...");
    try {
        // Try to find one user to check read access
        const user = await prisma.user.findFirst();
        console.log("✅ Read User Table Successful. Found:", user ? "1 user" : "0 users");
    } catch (e) {
        console.error("❌ Failed to read User table:", e);
    }

    console.log("3. Testing Write with New Columns...");
    try {
        const email = `test_diag_${Date.now()}@test.com`;
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: "hashed_dummy_password",
                credits: 5,
                lastRefill: new Date()
            }
        });
        console.log("✅ Write Successful. User created with ID:", newUser.id);
        console.log("   Credits:", newUser.credits);
        console.log("   LastRefill:", newUser.lastRefill);

        // Cleanup
        await prisma.user.delete({ where: { id: newUser.id } });
        console.log("✅ Cleanup Successful.");
    } catch (e) {
        console.error("❌ Failed to create user with 'credits'/'lastRefill'.");
        console.error("   Error:", e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
