# Laughing Palm tree

## A reproduction repo for Clerk

This repo reproduces a bug where sometimes, the page will be stuck with <ClerkLoading> and <ClerkLoaded> will never render.

To reproduce the issue:

1. Clone this repo and run 'npm install'

2. Configure your environment. Create a .env file that looks like the following:

```
CLERK_PUBLISHABLE_KEY=pk_test_********
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_********
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
```

3. Either run the server with 'npm run prod' or if you prefer to have a container, use 'docker compose up -d'

4. Navigate to http://localhost:3000/. If Clerk is working, you should see a Happy Palm tree. If Clerk is not working (and this bug is reproduced), you will see a sad palm tree stuck on screen.

**This bug is intermittent and probably won't happen the first time you go to the app.**

Try different URLs - any route is set up to render the same page. For example, try [http://localhost:3000/page1](http://localhost:3000/page1), and then [http://localhost:3000/page2](http://localhost:3000/page2), and then [http://localhost:3000/page2/and/a/half](http://localhost:3000/page2/and/a/half)...

Each time, type the new URL directly into the browser URL bar and press Enter.

Make sure to try different URLs each time.

You will eventually see the issue when the palm tree stays sad.
