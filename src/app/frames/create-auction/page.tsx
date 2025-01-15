import { Metadata } from "next";
import CreateAuctionApp from "./app";

const appUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_URL;

interface Props {
  params: Promise<{
    name: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;

  const frame = {
    version: "next",
    imageUrl: `${appUrl}/frames/create-auction/opengraph-image`,
    button: {
      title: "Create an Auction",
      action: {
        type: "launch_frame",
        name: "Create an Auction",
        url: `${appUrl}/frames/create-auction/`,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: "#f7f7f7",
      },
    },
  };

  return {
    title: `Hello, ${name}`,
    description: `Create a cryptoart auction`,
    openGraph: {
      title: `Hello, ${name}`,
      description: `A personalized hello frame for ${name}`,
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default async function CreateAuctionFrame({ params }: Props) {
  const { name } = await params;


  return <CreateAuctionApp />;
}
