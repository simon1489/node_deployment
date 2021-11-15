# Deployment Steps

Pasadena App works with several technologies, which the main ones are **ReactJS**, **NodeJS** and a plugin made with **jQuery** called _Fancy product designer_. The following steps is to configure successfully a server (Droplet in Digital Ocean) with all the needed things to make the app works as expected.

## Initial Setup

First, let's update the server with the following commands:

```
$ sudo apt-get update
$ sudo apt-get upgrade
```

Also, review if `build-essentials` is installed because some `npm` packages need to be compiled during the installation. If it is not installed, then run the following command:

```
$ sudo apt install build-essential
```

Almost all technologies are Javascript related, so, the main idea is to use a same environment to contain all of them and work smoothly together. To achieve that, ensure that the following things are installed in the server, if some of them are not installed, then install them with the command specified:

| Name      | Version    | Command to Install        |
| --------- |:----------:| ------------------------- |
| **node**  | >= 12.19.0 | `sudo apt install nodejs` |
| **npm**   | >= 6.14.8  | `sudo apt install npm`    |
| **nginx** | >= 1.18.0  | `sudo apt install nginx`  |
| **git**   | >= 2.25.1  | `sudo apt install git`    |
| **pm2**   | >= 4.4.0   | `sudo npm install pm2 -g` |

Probably, some of those packages/programs need extra settings that are going to be approached later.

## Create a New User

It's recommended to create a new user to manage the new applications and all processes related to. To achieve that, follow the next steps:

1. Logged in as `root`, create the user with the desired name, for example, `nodejs`:

   ```
   $ adduser nodejs
   ```

2. Previous command it is going to ask a strong password for new user. Store the password in a **safe place or password manager** like LastPass.

3. Grant administrative privileges to the new user (needs to be logged in as `root`):

   ```
   $ usermod -aG sudo nodejs
   ```

4. Test the new user logging out and logging in with the new user and its credentials. This user must be able to run commands using `sudo`.

## Setting up a Basic Firewall

Enable/Disable all the applications that have open ports to internet, to do that use `ufw`. It's recommended only to allow the HTTP traffic and the other traffic be limited or disabled. For example, let's deny all traffic related to FTP service:

1. List all available applications:

   ```
   $ sudo ufw app list
   ```

   As a result, you can get:

   ```
   Available applications:
     Nginx Full
     Nginx HTTP
     Nginx HTTPS
     OpenSSH
   ```

2. List current applied rules to the firewall:

   ```
   $ sudo ufw status
   ```
   
   As a result, you can get:

   ```
   Status: active

   To                         Action      From
   --                         ------      ----
   OpenSSH                    ALLOW       Anywhere
   OpenSSH (v6)               ALLOW       Anywhere (v6)
   21/tcp                     ALLOW       Anywhere
   21/tcp (v6)                ALLOW       Anywhere (v6)
   ```

3. To deny a service, for example FTP, let's run the following command:

   ```
   $ sudo ufw deny ftp
   ```

   Now, if you run `sudo ufw status`, you can see that `21/tcp` service is denied.

4. To active a service in the firewall, for example `nginx`, you can run the following command:

   ```
   $ sudo ufw allow 'Nginx Full'
   ```

   This is going to active `Nginx Full` service, this means, all connections using 80 and 443 ports are going to be allowed by the server. To restrict much more the traffic, you can use `Nginx HTTP` to only accept HTTP traffic or `Nginx HTTPS` to only accept HTTPS traffic.

5. Sometimes, it is needed to re-enable `ufw` after a change is made. To achieve that, then run:

   ```
   $ sudo ufw enable
   ```

   Type “y” and press `ENTER` to proceed.

The Pasadena app only is going to use the HTTPS trafic, so it is recommended to allow only that traffic and disable the another ones. The server can use SSH traffic for authentication and connection to Bitbucket, so maybe it's good to allow SSH traffic also but limited.

## Creating a SSH key to access GIT repositories

It is easier to access all git repositories using SSH because the authentication it is not going to be prompted everytime that an action is performed. To achieve that, run the following commands:

1. If it is needed, backup old keys generated. The keys are located at `~/.ssh`.

2. Generate new key:

   ```
   $ ssh-keygen -t rsa -C "your_email@example.com"
   ```

3. After process is finished, the new key is located at `~/.ssh`. If everything was left by default in the previous command, the keys are named `id_rsa` and `id_rsa.pub` (private and public keys respectively).

4. Now, the public key must be copied to the Bitbucket server. You can do that using FTP to retrieve the public key in a safe place or using `ssh-copy-id`. If FTP traffic is disabled, re-enable it temporarily with `ufw`.

5. All the details to configure the public key in the bitbucket can be readed [here](https://confluence.atlassian.com/bitbucketserver/ssh-access-keys-for-system-use-776639781.html).

6. Now, the server is going to be able to retrieve the repositories and use the common `git` commands over those repos.

## Clone the repos and configure

1. Clone `psp-api` and `psp-client` repos. The content of both repos must be located at `/var/www/` or have a symbolic link in that folder.

2. Checkout `master` or production branch if needed.

3. Run `sudo npm install` in each folder to install all needed packages.

4. Ensure that both repos have their respective `.env` file at the root of the folder. Created them with the following content:

   `.env` for `psp-client`
   ```
   REACT_APP_API_URL=https://pasadenascreenprinting.com/api
   REACT_APP_FPD_URL=https://pasadenascreenprinting.com/fpd
   REACT_APP_FPD_BASE_URL=https://pasadenascreenprinting.com
   REACT_APP_HOME_URL=https://pasadenascreenprinting.com
   ```

   `.env` for `psp-api`
   ```
   PORT=8000
   MONGO_URI=mongodb+srv://your_mongo_db_uri
   JWT_SECRET=your_jwt_secret
   API_URL=https://pasadenascreenprinting.com/api
   FRONTEND_BUILD_PATH=../psp-client/build
   FRONTEND_BUILD_INDEX=index.html
   ```

   The `JWT_SECRET` can be configured the first time with a strong passphrase, but **must be after stored** in some secure place, because the passphrase must be the same always so future ongoing tokens cannot be invalidated by error. `MONGO_URI` var must point to the MongoDB service, actually this exact value is not store in this document for security reasons.

5. Move to `psp-client` folder and run `sudo npm run build`. This is going to create the `build` folder for the **ReactJS** app and is the folder that the `psp-api` app use to serve the pages related to the client-side, so `FRONTEND_BUILD_PATH` and `FRONTEND_BUILD_INDEX` env vars must point to the correct values. Ensure also that the `.env` file for `psp-client` has the correct values so the building process can use the expected values.

6. Create `images/views` and `images/products` folders in `psp-api`.

7. Change files and folder permisions:

   ```
   $ sudo chown -R nodejs:nodejs /var/www/psp-client
   $ sudo chown -R nodejs:nodejs /var/www/psp-client/*
   $ sudo chown -R nodejs:nodejs /var/www/psp-api
   $ sudo chown -R nodejs:nodejs /var/www/psp-api/*
   ```

   Note that we are using `nodejs` user created previously, this is because this is the user that is going to run our app and the one that has the permissions to use it.

8. Run `git status` to review if there are changes, it should not have any pending changes. If there are changes, discard them.

## Configure Nginx

`nginx` is going to be our server. To configure it correctly for this project, follow these instructions:

1. Ensure that `nginx` service is running:

   ```
   $ sudo systemctl status nginx 
   ```

   As a result, you must get that the service is running, if not, run then `sudo systemctl start nginx`.

2. Edit the `default` site available of the server. It is located at `/etc/nginx/sites-available/`:

   ```
   $ sudo nano /etc/nginx/sites-available/default
   ```

4. Apply the following changes:

   ```
   server {

       # If HTTP/80 traffic is going to be denied, this must be commented in and commented out the SSL section.
       listen 80 default_server;
       listen [::]:80 default_server;

       # SSL Configuration
       #
       # listen 443 ssl default_server;
       # listen [::]:433 ssl default_server;

       # ...

       # change the folder where the the app is, in our case psp-api
       root /var/www/psp-api;

       server_name pasadenascreenprinting.com www.pasadenascreenprinting.com;

       # Commented in the gzip processing

       location / {
           proxy_http_version 1.1;
           proxy_cache_bypass $http_upgrade;

           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;

           # ...

           # Ensure to configure the proxy_pass that points to the psp-api nodejs server
           proxy_pass http://localhost:8000;
       }
   }
   ```

   Save the file and check if the syntax was correct running `sudo nginx -t`.

5. Restart Nginx:

   ```
   $ sudo systemctl restart nginx
   ```

# Install and Configure Let's Encrypt

**Let's Encrypt** is a Certification Authority (CA) that provides a simple way to obtain and install signed certificates TLS/SSL totally free, so the HTTPS traffic can be used for the app. Follow these steps to configure **Let's Encrypt** correctly in the server:

1. Install Certbot software:

   ```
   # sudo apt install certbot python3-certbot-nginx
   ```

2. Confirm that `nginx` is configured correctly. This means, ensure that the `server_name` is pointing to the desired domain (_pasadenascreenprinting.com_), if not, set it and then reload the service `sudo systemctl reload nginx`.

3. Enable HTTPS traffic for `nginx`:

   ```
   $ sudo ufw allow 'Nginx Full'
   $ sudo ufw delete allow 'Nginx HTTP'
   ```

4. Obtain the certificate:

   ```
   $ sudo certbot --nginx -d example.com -d www.example.com
   ```

   The process ask several pretty straight forward things.

5. Verify that the auto-renewal is active:

   ```
   Output
   ● certbot.timer - Run certbot twice daily
        Loaded: loaded (/lib/systemd/system/certbot.timer; enabled; vendor preset: enabled)
        Active: active (waiting) since Mon 2020-05-04 20:04:36 UTC; 2 weeks 1 days ago
      Trigger: Thu 2020-05-21 05:22:32 UTC; 9h left
     Triggers: ● certbot.service
   ```

   Also, you can simulate the renewal process using `sudo certbot renew --dry-run`, if there is no errors, it's done.

6. Try now to access the domain, note that now is using a SSL certificate.

## Configure PM2

The last step is to configure `pm2` service to control our node app. First, let's get rid of the default node app (if any) as follows:

```
$ sudo -u nodejs pm2 delete hello
$ sudo -u nodejs pm2 save --force
```

Note that we are using `nodejs` user to schedule the process, because that will be the user that will handle always our app.

Now, create a new rule that points to our app as follows:

```
$ sudo -u nodejs pm2 start /var/www/psp-api/app.js
```

To review the status of the processes, run: `pm2 status`.

Finally, restart `nginx` and save the `pm2` scheduler:

```
$ sudo systemctl restart nginx
$ sudo -u nodejs pm2 save --force
```

With this, our app can be already accessed through the `REACT_APP_HOME_URL` specified.
