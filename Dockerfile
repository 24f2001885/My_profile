# Lightweight Alpine Nginx Production Image (< 15 MB RAM footprint)
FROM nginx:alpine

LABEL maintainer="Abhishek Pathak <abhishekpathak4312@gmail.com>"
LABEL description="Abhishek Pathak Personal Developer Portfolio"

# Replace default Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets to webroot
COPY . /usr/share/nginx/html/

# Purge non-production documentation and repository metadata from webroot
RUN rm -rf /usr/share/nginx/html/plan \
           /usr/share/nginx/html/.github \
           /usr/share/nginx/html/.git

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
