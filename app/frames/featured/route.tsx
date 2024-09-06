/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../frames";
import { appURL } from "../../utils";
import { castList } from "../curate/mockDatabase";
// Helper function to fetch data for each item in the castList
async function fetchCastData(castList: any[]) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      api_key: process.env.NEYNAR_API_KEY || "", // Ensure the API key is set
    },
  };

  const fetchPromises = castList.map(async (item) => {
    try {
      const response = await fetch(`https://api.neynar.com/v2/farcaster/cast?identifier=${item.id}&type=hash`, options);
      console.log(`Fetch response for cast ID ${item.id}:`, response);
      
      if (!response.ok) {
        console.error(`Error fetching data for cast ID ${item.id}:`, response.statusText);
        return null;
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching data for cast ID ${item.id}:`, error);
      return null;
    }
  });

  return Promise.all(fetchPromises);
}

const frameHandler = frames(async (ctx) => {
  // get the cast list from the database

  // Fetch data for each item in the castList
  console.log("castList", castList);
  const castData = await fetchCastData(castList);
  console.log("castData", castData);
  return {
    image: (
      <div tw="flex flex-col">
        <div tw="flex">Featured</div>
        <div tw="flex">{castData.length}</div>
      </div>
    ),
    // textInput: "Say something",
    buttons: [
      <Button action="post" target={appURL()}>
        My Stats
      </Button>,
      <Button action="post" target={appURL()}>
        Browse 🖼️
      </Button>,
      <Button action="post" target={appURL()}>
        Submit 🎨
      </Button>,
      <Button action="post" target={appURL()}>
        Subscribe
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
