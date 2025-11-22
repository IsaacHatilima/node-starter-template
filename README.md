# Node API

## Postman Collection

- [Postman Collection](https://www.postman.com/isaachatilima/workspace/my-workspace/collection/11614696-4da53923-15c8-4c08-8907-99d63f730ca5?action=share&creator=11614696&active-environment=11614696-5db0d9d4-1005-4557-9ffc-3b9d03999ae7)

## Running API

```bash

# Install JavaScript dependencies
npm install

# Copy environment config and generate app key
cp .env.example .env

# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Run API
npm run dev

```