FROM node:alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

# 1. Copy package files AND the prisma schema first
COPY package.json yarn.lock ./
COPY prisma ./prisma/

USER node

# 2. Install dependencies
RUN yarn install --pure-lockfile

# 3. CRITICAL: Force Prisma to generate the correct RHEL binary inside the container
RUN npx prisma generate

# 4. Copy the rest of your source code
COPY --chown=node:node . .

EXPOSE 3000

# (Optional) Ensure you have your start command here if it isn't in your docker-compose
CMD ["yarn", "start"]