FROM node:12 as node
COPY /drone/src/package.json /app/package.json
COPY /drone/src/package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm install

COPY /drone/src /app

RUN npm run 11ty 2>&1 | tee out_11ty.txt

FROM nginx
COPY --from=node /drone/src/app/dist /usr/share/nginx/html


