
#### Built on top of the 🖼️ frames-v2-demo example repo.

This is a [NextJS](https://nextjs.org/) + TypeScript + React app.

To install dependencies:

```bash
$ pnpm i
```

To run the app:

```bash
$ pnpm dev
```

To try your app in the Warpcast playground, you'll want to use a tunneling tool like [ngrok](https://ngrok.com/).

We've build a simple v2 frame by:

1. Setting up a NextJS web app
2. Importing the Frames SDK and calling `sdk.actions.ready()`
3. Reading the user context from `sdk.context`
4. Invoking actions using `sdk.actions`
5. Connecting to the user's wallet using Wagmi and `sdk.wallet.ethProvider`

Happy Framesgiving! 🖼️🦃
