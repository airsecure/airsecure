# AirSecure

AirSecure is an open-source, zero trust two factor authentication manager. The AirSecure app manages your 2FA accounts (e.g. GitHub and Coinbase) and will issue you new access tokens to your accounts entirely on device without any 3rd party servers, tracking, or off device processing. 

## Available on Android & iOS

![img_2129](https://user-images.githubusercontent.com/370259/52906826-2a2e7a80-3212-11e9-9d63-c350b9823a85.png)

[Google Play](https://play.google.com/store/apps/details?id=io.textile.airsecure)

[Apple App Store](https://testflight.apple.com/join/dVh9i7hX)

[FDroid]() `send PR please`

### How it works

Inside of AirSecure, each client creates a secure, on-device private wallet to store private keys to their encrypted entries. This is done using [Textile](https://github.com/textileio/textile-go/wiki) to create the wallet, encrypte the data, and manage keys on the user's behalf. Next, we will add Textile's device sync capability and remote backup capability to make secret management a bit easier for everyone. 

### TODO

- Multi-device sync through end-to-end encrypted [Threads](https://medium.com/textileio/wip-textile-threads-whitepaper-just-kidding-6ce3a6624338)
- Secure recovery through remote-device backup

### Creators

Project Lead: [Cody Hatfield](https://github.com/codynhat)

Contributors: [Carson Farmer](https://twitter.com/carsonfarmer), [Andrew Hill](https://twitter.com/andrewxhill)
