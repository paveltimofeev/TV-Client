#cp nginx.conf .nginx/conf/nginx.conf

mkdir .private

echo generate ssl keys
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
   -subj "//C=UK/ST=sNYC/L=AT/O=NGINX/OU=PROXY/CN=localhost" \
   -keyout ./.private/ssl.key \
   -out ./.private/ssl.pem #-config ./openssl.cnf

echo "SETUP BASIC AUTH"
echo "SET USER NAME:"
read usr
echo "SET USER PASS:"
read pas

echo generate basic auth login/pass
echo -n '$usr:$pas' > ./.private/.htpasswd
openssl passwd -apr1 pass >> ./.private/.htpasswd

