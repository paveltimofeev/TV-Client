FROM cusspvz/node:0.12.7

ENV CHANGE_DATE="17-Dec-2015" 

ENV VK_LOGIN="name@server.com" \
    VK_PASSW="pawssodr" \
    VK_SCOPE="audio,video" \
    VK_APPID="1234567"
        
ADD proxy.js /app/
ADD auth.js /app/
ADD package.json /app/

RUN cd /app/ && npm install

ENTRYPOINT ["sudo", "npm", "start", "${VK_LOGIN}", "${VK_PASSW}", "${VK_SCOPE}", "${VK_APPID}"]

EXPOSE 8080 
