#!/bin/bash

if [ -e /usr/local/bin/teamchat ]; then
	echo "Init has been done! please type 'teamchat' to run TeamChat Server App"
else
	chmod u+x ${PWD}/app.js && ln -s ${PWD}/app.js /usr/local/bin/teamchat && chown ${USER} /usr/local/bin/teamchat 
	if [ "$?" -eq 0 ]; then
		echo "init finished, type 'teamchat' to run TeamChat Server App"
	fi
fi