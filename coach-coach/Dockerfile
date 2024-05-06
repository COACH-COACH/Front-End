# 빌드 스테이지
FROM node:20.12-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VUE_APP_API_URL
ENV VUE_APP_API_URL=${VUE_APP_API_URL}
RUN npm run build

# 프로덕션 스테이지
FROM nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Nginx 설정 파일을 이미지에 복사
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
