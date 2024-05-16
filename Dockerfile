FROM node:12 as node
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm install

COPY ./src /app/src

RUN npm run contributions
RUN DEBUG=Eleventy* npm run 11ty 2>&1 | tee out_11ty.txt

FROM nginx
COPY --from=node /app/src/app/dist /usr/share/nginx/html


