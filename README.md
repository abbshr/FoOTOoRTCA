#RTCA

RealTime Chat app

How to run it?
--
Before this, make sure a Node.js 0.8+ runtime has been installed.

first clone this repo to your local directory:

	git clone git@github.com:abbshr/FoOTOoRTCA.git && cd FoOTOoRTCA
    
then run the bash file as root:

	sudo bash initOnce.sh
    
or

	sudo initOnce.sh
    
before running the Server, you must configure SMTP-Server info in `settings.js` correctly!
    
ok! let's just run `app.js` or from terminal:

	teamchat
    
open a new tab `http://localhost:3000` in Chrome to start Client
    
press `CTRL + C` to abort the process 
