import { PrismaClient } from "@prisma/client";

const USERNAME = process.env.NEXT_PUBLIC_USERNAME!;
if (!USERNAME) {
  throw new Error("process.env.NEXT_PUBLIC_USERNAME is not defined");
}

const prisma = new PrismaClient();

async function main() {
  const mainUser = await prisma.userEntity.upsert({
    where: { id: USERNAME },
    update: {},
    create: {
      id: USERNAME,
    },
  });
  console.log("Added main user", mainUser);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
