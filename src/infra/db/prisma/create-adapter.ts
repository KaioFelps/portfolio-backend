import { PrismaPg } from "@prisma/adapter-pg";

export function createPgAdapter(connString: string) {
  const schema = new URL(connString).searchParams.get("schema")!;
  return new PrismaPg(
    { connectionString: process.env["DATABASE_URL"], options: `-c search_path="${schema}"` },
    { schema },
  );
}
