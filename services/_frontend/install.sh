echo copy nginx config
cp nginx.conf .nginx/conf/nginx.conf

echo generate ssl keys
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
   -subj "//C=UK/ST=sNYC/L=AT/O=NGINX/OU=PROXY/CN=localhost" \
   -keyout ./.private/ssl.key \
   -out ./.private/ssl.pem #-config ./openssl.cnf

echo generate basic auth login/pass
echo -n 'user:' > ./.private/.htpasswd
openssl passwd -apr1 pass >> ./.private/.htpasswd

