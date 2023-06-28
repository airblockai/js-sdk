# js-sdk

airblock Javascript SDK collects and sends browser events to an event collector of your choice.

You'll need Node.js and a package manager like npm or yarn.

### Install SDK
Run `npm install --save @airblock/js-sdk` to install the SDK locally.

We have built-in typescript support so you do not need to install the types for the SDK.

### Initialize SDK
You must initialize the SDK before you collect any events.

To initialize, you must provide the `SERVER_URL` of your event collector and a string as `API_KEY` to identify your application. 

```js
import * as airblock from "@airblock/js-sdk";
 
const API_KEY = "app1"; // required
const SERVER_URL = "https://..."; // required
 
airblock.init(API_KEY, SERVER_URL);
```

Once initialized, the SDK will start sending default events to your event collector.
