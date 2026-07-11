import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, adminsTable, pool } from "@workspace/db";

async function main() {
  const username = "UltimateAdmin";
  const password = "Ultimate@2006";

  const passwordHash = await bcrypt.hash(password, 10);

  const [existing] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.username, username));

  if (existing) {
    await db
      .update(adminsTable)
      .set({ passwordHash, mustChangePassword: false })
      .where(eq(adminsTable.username, username));
    console.log(`Admin "${username}" password reset successfully.`);
  } else {
    await db.insert(adminsTable).values({
      username,
      passwordHash,
      mustChangePassword: false,
    });
    console.log(`Admin "${username}" created successfully.`);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
