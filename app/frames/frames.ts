import { createFrames } from "frames.js/next";
import {
  farcasterHubContext,
  warpcastComposerActionState,
} from "frames.js/middleware";

const hubUrl = process.env.NEYNAR_RPC;

type State = {
  counter: number;
};

export const frames = createFrames<State>({
  basePath: "/frames",
  initialState: { counter: 0 },
  debug: process.env.NODE_ENV === "development",
  middleware: [
    farcasterHubContext({
      hubHttpUrl: hubUrl,
    }),
    warpcastComposerActionState(),
  ],
});
