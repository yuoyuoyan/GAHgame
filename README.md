# GAHgame

This is the Javascript version of Grand Austria Hotel game.

## Bring up

Package required: npm, websocket, http-server, vscode. Package installation later.

Local bring up with vscode live server:
``` Shell
cd GAHGAME/src/js
node gameServer.js
# modify the index.js line 2 to use ws://localhost:8083
```
Then click "Go Live" button at right bottom corner with index.html opened.

Server bring up with http-server:
``` Shell
cd GAHGAME
# nohup to run at back, -c-1 to disable cache, use port 8081, set address to all for EIP, -g to use gzip to reduce size, disown to keep it running after ssh closed
nohup http-server ./ -c-1 -p 8081 -a 0.0.0.0 -g > httpServer.log 2>&1 &
disown
cd src/js
nohup node gameServer.js > gameServer.log 2>&1 &
disown
```

To close server at back ground:
```Shell
ps -ef | grep "http-server"
ps -ef | grep "gameServer"
kill -9 [the PID you read]
```

### npm install

nvm not stable in CN, prefer to download prebuilt binaries node.js v20.16.0 here:
https://nodejs.org/en/download/prebuilt-binaries

In Linux, decompress and set path:
```Shell
mv node-v20.16.0-linux-x64.tar.xz ~
cd
tar -xvJf node-v20.16.0-linux-x64.tar.xz
# Add the following line into ~/.bashrc
export PATH="~/node-v20.16.0-linux-x64/bin:$PATH"
source ~/.bashrc
# test
npm -v
node -v
```

### websocket install

``` Shell
cd GAHGAME/src/js
# Change source for CN environment
npm config set registry=https://registry.npmmirror.com
npm install ws
```

### http-server install

``` Shell
# No need to repeat if already do so in websocket
cd GAHGAME/src/js
# Change source for CN environment
npm config set registry=https://registry.npmmirror.com
npm install http-server
```

### vscode

Install live server, just search for the extension and get the most popular one

## Code structure

-src -cpp:            previous cpp version, incomplete
  |  -css:            style css files, hotelgameStyle.css no longer used, single-player mode debug code
  |  -image:          All jpg pictures used in web
  |  -js:             Javascript code, index.js used as main code, gameServer.js used independently as server
-tutorial:            Code from other site to learn Javascript and html
-hotelgame.html:      legacy single-player mode for debug
-index.html:          main page


# TODO

1. Need to add a cancellation function as people can mis-click
2. Change dice number to real dice images, make it more straightforward
3. Separate food buffer from kitchen
4. Don't calculate unsatisfied guest before game end
5. Add a chat board in room waiting stage
6. Iphone cannot access server, need to debug
7. Develop a better phone-based version