import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const users = [
        {
            nama: 'Alice',
            email: 'alice@example.com',
            password: bcrypt.hashSync('password123',10),
            createdBy: 'Alice',
            updatedBy: 'Alice',
        },
        {
            nama: 'Bob',
            email: 'bob@example.com',
            password: bcrypt.hashSync('password123',10),
            createdBy: 'Bob',
            updatedBy: 'Bob',

        },
        {
            nama: 'Charlie',
            email: 'charlie@example.com',
            password: bcrypt.hashSync('password123',10),
            createdBy: 'Charlie',
            updatedBy: 'Charlie',
        },
    ];

    for (const user of users) {
        await prisma.users.upsert({
            where: { email: user.email },
            update: {},
            create: user,
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });