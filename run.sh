npm ci --omit=dev --maxsockets=5
npx prisma migrate deploy
npx prisma generate
npm run start:prod