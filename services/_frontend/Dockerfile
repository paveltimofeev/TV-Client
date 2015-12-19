FROM nginx

ENV CHANGE_DATE="19-Dec-2015"

ENV BA_LOGIN="user" \
    BA_PASSW="pass" 
    
#COPY html/solid_state/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY install.sh /etc/nginx/install.sh

# Generate ssl certificate and basic auth creds
RUN apt-get update && apt-get install sudo && sudo bash /etc/nginx/install.sh ${BA_LOGIN} ${BA_PASSW}

ENTRYPOINT ["service", "nginx", "start"]

EXPOSE 80 443
