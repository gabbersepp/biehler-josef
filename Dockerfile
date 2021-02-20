FROM node:12 as node

RUN npm run 11ty 2>&1 | tee out_11ty.txt

FROM nginx
COPY --from=node /drone/src/app/dist /usr/share/nginx/html


