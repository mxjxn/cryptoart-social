export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  const config = {
    accountAssociation: {
      header: 'eyJmaWQiOjQ5MDUsInR5cGUiOiJjdXN0b2R5In0',
      payload: 'eyJkb21haW4iOiJjcnlwdG9hcnQuc29jaWFsIn0',
      signature: 'napUQR3xiHzh8-vGIXMKAcn0HiWQdydk37x12sGVy8gw3oR4h2tvTTjGKUj3QZC5UOj6NpkTEzVd1zy3IGKvSxw'
    },
    frame: {
      version: "0.0.0",
      name: "Cryptoart Social",
      iconUrl: `${appUrl}/icon.png`,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#000000",
      homeUrl: appUrl,
    }
  }
  return Response.json(config);
}