import { PrismaPg } from "@prisma/adapter-pg";

export function createPgAdapter(connString: string) {
  const schema = new URL(connString).searchParams.get("schema") ?? undefined;
  const options = schema ? `-c search_path="${schema}"` : undefined;
  return new PrismaPg({ connectionString: process.env["DATABASE_URL"], options }, { schema });
}
