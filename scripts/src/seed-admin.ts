import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, adminsTable, pool } from "@workspace/db";

async function main() {
  const username = "UltimateAdmin";
  const [existing] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.username, username));

  if (existing) {
    console.log("Admin already exists, skipping seed.");
    await pool.end();
    return;
  }

  const passwordHash = await bcrypt.hash("Ultimate@2006", 10);
  await db.insert(adminsTable).values({
    username,
    passwordHash,
    mustChangePassword: true,
  });

  console.log("Seeded default admin:", username);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
