FROM nginx

ENV CHANGE_DATE="17-Dec-2015"

COPY html/solid_state/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY install.sh /etc/nginx/install.sh

# Generate ssl certificate and basic auth creds
RUN apt-get update && apt-get install sudo && sudo bash /etc/nginx/install.sh

ENTRYPOINT ["nginx"]

EXPOSE 80 443
