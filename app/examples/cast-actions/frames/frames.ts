import { createFrames } from "frames.js/next";
import { appURL } from "../../../utils";
import {
  farcasterHubContext,
  warpcastComposerActionState,
} from "frames.js/middleware";

const hubUrl = process.env.NEYNAR_RPC;

export const frames = createFrames({
  baseUrl: `${appURL()}/examples/cast-actions/frames`,
  debug: process.env.NODE_ENV === "development",
  middleware: [
    farcasterHubContext({
      hubHttpUrl: hubUrl,
    }),
    warpcastComposerActionState(),
  ],
});
