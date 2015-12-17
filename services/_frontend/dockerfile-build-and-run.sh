echo -n "ENTER PORT FOR FRONTEND:"
read port
echo -n "ENTER BASIC AUTH LOGIN:"
read BA_LOGIN
echo -n "ENTER BASIC AUTH PASSWORD:"
read BA_PASSW

docker build -t frontend .
docker run -it --rm -p $port:443 -d=false --env BA_LOGIN="$BA_LOGIN" --env BA_PASSW="$BA_PASSW" --name frontend frontend 
