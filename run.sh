npm ci --omit=dev
npx prisma migrate deploy
npx prisma generate
npm run start:prod