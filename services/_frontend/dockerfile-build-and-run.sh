echo "ENTER PORT FOR FRONTEND:"
read port
docker build -t frontend .
docker run -it --rm -p $port:443 -d=false --name frontend frontend 
