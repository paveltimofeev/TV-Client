#cp nginx.conf .nginx/conf/nginx.conf

location=/frontend/.private
usr=$1
pas=$2

mkdir $location -p

echo generate ssl keys
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
   -subj "//C=UK/ST=sNYC/L=AT/O=NGINX/OU=PROXY/CN=localhost" \
   -keyout $location/ssl.key \
   -out $location/ssl.pem #-config ./openssl.cnf

echo generate basic auth login/pass
echo -n '$usr:' > $location/.htpasswd
openssl passwd -apr1 $pas >> $location/.htpasswd

