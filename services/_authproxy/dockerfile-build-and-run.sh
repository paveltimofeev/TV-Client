echo "SETUP VK AUTH PROXY"
echo -n "TYPE LOGIN: "
read LOGIN
echo -n "TYPE PASSWORD: "
read PASSW
echo -n "TYPE APPLICATION ID: "
read APPID

docker rm auth-proxy
docker rmi vk-auth-proxy
docker build -t vk-auth-proxy .
docker run -it --rm --env VK_LOGIN="$LOGIN" --env VK_PASSW="$PASSW" --env VK_APPID="$APPID" --name auth-proxy vk-auth-proxy
