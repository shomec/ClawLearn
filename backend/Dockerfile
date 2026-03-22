FROM node:22-slim

WORKDIR /app

# Ensure curl and openclaw are installed
RUN apt-get update && apt-get install -y curl git && rm -rf /var/lib/apt/lists/* && \
    npm install -g openclaw

COPY package.json .
RUN npm install

COPY . .

# Ensure entrypoint is executable
RUN chmod +x entrypoint.sh

EXPOSE 8000

CMD ["bash", "entrypoint.sh"]
