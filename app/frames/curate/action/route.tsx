/* eslint-disable react/jsx-key */
import { NextRequest } from "next/server";
import { Button } from "frames.js/next";
import { appURL } from "../../../utils";
import { frames } from "../../frames";
import { castAction, castActionFrame, castActionMessage } from "frames.js/core";
import { castList } from "../mockDatabase";

export const GET = async (req: NextRequest) => {
  return castAction({
    action: {
      type: "post",
    },
    icon: "save",
    name: "Save Cast Info",
    aboutUrl: `${appURL()}/frames/curate/action`,
    description: "Save the cast information to a list.",
  });
};

export const POST = frames(async (ctx) => {
  const castInfo = ctx.message?.castId; // Assuming castId contains the necessary info

  console.log({ctx})
  console.log("castInfo", castInfo);
  if (castInfo) {
    castList.push(castInfo); 
    console.log("castList", castList);
    return castActionFrame(`${appURL()}/frames/curate/frame`);
  }
  return castActionMessage("No cast info provided.");
});
