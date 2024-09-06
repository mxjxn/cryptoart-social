/* eslint-disable react/jsx-key */
import { frames } from "../../frames";
import { Button } from "frames.js/next";
import { castList } from "../mockDatabase";

const frameHandler = frames(async (ctx) => {
  // Get the cast list from the database

  return {
    image: (
      <div tw="flex flex-col">
        <h1 tw="text-2xl font-bold">Curated Cast List</h1>
        {castList.length > 0 ? castList.map((cast) => (
          <div tw="flex">
            <div tw="flex mr-2">{cast.fid}</div>
            <div tw="flex">{cast.hash}</div>
          </div>
        )) : <div tw="flex">No casts in list</div>}
      </div>
    ),
    actions: [
      <Button action="post" target={{ pathname: "/" }}>
        Home
      </Button>,
    ],
  };
});

export default frameHandler;

export const GET = frameHandler;
export const POST = frameHandler;
