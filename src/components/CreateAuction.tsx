"use client";

import { useEffect, useCallback, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import  Context from "@farcaster/frame-core";
import { useAccount, useSendTransaction, useDisconnect, useConnect } from "wagmi";
import { config } from "~/components/providers/WagmiProvider";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";
import { CreateAuctionProps } from "~/types";

export default function CreateAuction({ chainId, contractAddress, tokenId }: CreateAuctionProps) {
  const [context, setContext] = useState<Context.FrameContext>();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready();
      console.log("sdk is ready")
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">Create Auction</h1>
    </div>
  );
}
