FROM node:21 as node
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm install

COPY . /app

RUN npm run 11ty 2>&1 | tee out_11ty.txt

FROM nginx
COPY --from=node /app/app/dist /usr/share/nginx/html


