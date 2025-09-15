import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
async function main() {
    console.log("Start seeding...");
    // 1. Clean up existing data to prevent conflicts
    await prisma.note.deleteMany();
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();
    console.log("Cleaned up old data.");
    // 2. Hash the common password
    const hashedPassword = await bcrypt.hash("password", 10);
    console.log("Password hashed.");
    // 3. Create the tenants
    const acmeTenant = await prisma.tenant.create({
        data: {
            name: "Acme",
            slug: "acme",
            plan: "Free", // Acme starts on the Free plan
        },
    });
    const globexTenant = await prisma.tenant.create({
        data: {
            name: "Globex",
            slug: "globex",
            plan: "Pro", // Let's put Globex on the Pro plan for testing
        },
    });
    console.log("Created tenants:", acmeTenant.name, globexTenant.name);
    // 4. Create the mandatory test users
    const adminAcme = await prisma.user.create({
        data: {
            email: "admin@acme.test",
            password: hashedPassword,
            role: Role.Admin,
            tenantId: acmeTenant.id,
        },
    });
    const userAcme = await prisma.user.create({
        data: {
            email: "user@acme.test",
            password: hashedPassword,
            role: Role.Member,
            tenantId: acmeTenant.id,
        },
    });
    const adminGlobex = await prisma.user.create({
        data: {
            email: "admin@globex.test",
            password: hashedPassword,
            role: Role.Admin,
            tenantId: globexTenant.id,
        },
    });
    const userGlobex = await prisma.user.create({
        data: {
            email: "user@globex.test",
            password: hashedPassword,
            role: Role.Member,
            tenantId: globexTenant.id,
        },
    });
    console.log("Created users.");
    // 5. (Optional) Create some initial notes for testing the Free plan limit
    await prisma.note.createMany({
        data: [
            {
                title: "Acme Note 1",
                content: "This is the first note for the Acme tenant.",
                authorId: userAcme.id,
                tenantId: acmeTenant.id,
            },
            {
                title: "Acme Note 2",
                content: "This is the second note.",
                authorId: userAcme.id,
                tenantId: acmeTenant.id,
            },
        ],
    });
    console.log("Created sample notes for Acme.");
    console.log("Seeding finished.");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map