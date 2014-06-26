# JENKING

Would you rather spend your time doing this:

1. going through each failing gerrit patch page
2. visiting their failed Jenkins job pages
3. clicking the Console tab
4. taking a brief glance at what's gone bad, betting nine out of ten that it's just a Jenkins act
5. pushing the retrigger button in case it is

Or, say, sit on a couch instead?

JENKING helps you sit on couches and be more lazy over-all. It grabs all your active Gerrit patches and the Jenkins jobs for their latest patchsets. You then have the chance to view their console outputs, or simply retrigger the ones that failed, from a single unified place.

No need to open a hundred tabs, or waste too much time.

Optionally, JENKING can try to act smart by giving you an estimate of how likely the failures of jobs are genuine failures and not just a Jenkins act. For example, Selenium jobs often fail promptly with "No Live Servers." In which case, JENKING tries to act like a real king by offering you the choice of automatically re-triggering all such jobs.

## Getting JENKING

Accommodating our commitment to laziness, getting JENKING up takes 34 keystrokes:

```bash
npm install -g jenking
jenking
```

If you need `sudo` to do that first one, I'm sorry.

Open up [http://localhost:8000] and log-in as you would to Gerrit.

## Hacking JENKING

1. Clone the repo
2. `npm install`
3. run `grunt` which will spawn an instance of the `jenkingd` daemon and `connect` to serve the thing for you.

You must have [jenkingd](https://github.com/amireh/jenkingd) running for `jenking` to do anything useful. You can launch it in stand-alone mode by installing it `npm install -g jenkingd` and running it using `jenkingd`.

Currently, `jenkingd` goes on port `8777` and it's hard-coded.

You can also get rid of `connect` and use nginx/apache httpd to do the proxying between jenking and jenkingd. jenking expects all calls to `/api` to be (reverse) proxied to `jenkingd` because `jenkingd` doesn't really support CORS, nor has any notion of it.

Here's a sample httpd conf:

```httpd
<VirtualHost *:80>
  ServerName jenking.localhost.com

  DocumentRoot /var/www/jenking/www

  ProxyPass /api/ http://localhost:8777/
  ProxyPassReverse /api/ http://localhost:3000/
  ProxyPreserveHost On

  <Directory /var/www/jenking/www>
    AllowOverride all
    Options -MultiViews
  </Directory>
</VirtualHost>
```

Don't forget the `/etc/hosts` entry:

```bash
sudo su - root -c 'echo "127.0.0.1 jenking.localhost.com" >> /etc/hosts'
```

## LICENSE

The MIT license.
(C) 2014 Ahmad Amireh <ahmad@instructure.com>, Instructure Inc.