"use client";

import dynamic from "next/dynamic";
import { CreateAuctionProps } from "~/types";

const CreateAuction = dynamic(() => import("~/components/CreateAuction"), {
  ssr: false,
});

export default function CreateAuctionApp(
  { chainId, contractAddress, tokenId }: CreateAuctionProps
) {
  return <CreateAuction 
    chainId={chainId} 
    contractAddress={contractAddress} 
    tokenId={tokenId} 
  />
}
