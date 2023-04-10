import RedisClient from './clients/RedisClient';
import type { IPage } from '../models/pageModel';

interface ParsedBlock {
  _id: string;
  text: string;
};

type BlockUpdateInfo = Record<string, boolean>;

/**
 * Returns a dictionary of block IDs to boolean values indicating whether
 * each block has been updated for the given page.
 * 
 * @param page The ID of the page to get block update information for.
 * @returns A dictionary of block IDs to boolean values.
 */
const getBlockUpdateInfo = async (page: string) => {
  // ~ Get the block update information for the given page from Redis.
  const blockUpdateInfoString = await RedisClient.get(`page:${page}`);

  // ~ If there is no block update information, return an empty object.
  if (!blockUpdateInfoString) {
    return {};
  }

  // ~ Parse the block update information string as an array of block IDs.
  const blockIDs = JSON.parse(blockUpdateInfoString) as string[];

  // ~ Convert the block IDs array to an object where each block ID is a key
  //   with a boolean value of `true`.
  return Object.fromEntries(blockIDs.map((blockID) => [blockID, true]));
};

/**
 * Chunk the blocks on a page into groups of blocks that have a total token count
 * less than the given maximum token count.
 * 
 * @param pageData The blocks on the page.
 * @param maxTokenCount The maximum token count for a chunk.
 * @param updateInfo A dictionary of block IDs to boolean values indicating whether
 *                   each block has been updated for the page.
 * @returns An array of chunks of blocks.
 */
const chunkBlocks = (pageData: IPage['data'], maxTokenCount: number, updateInfo: BlockUpdateInfo) => {
  // = Initialize an empty array to hold the chunks of blocks.
  const chunks: ParsedBlock[][] = [];

  // = Initialize an empty array to hold the current chunk of blocks.
  let chunk: ParsedBlock[] = [];

  // = Initialize a counter for the total number of tokens in the current chunk.
  let tokenCount = 0;

  // = Initialize a flag to indicate whether the current chunk needs to be updated.
  let doesNeedToUpdate = false;

  // ~ Loop over each block on the page.
  for (let i = 0; i < pageData.length; i += 1) {
    // ~ Get the current block.
    const block = pageData[i];

    // ~ Get the text content of the block.
    const text = block.properties.value as string | undefined;

    // ~ If the block has no text content, skip it.
    if (!text) {
      continue;
    }

    // ~ Split the text content into tokens.
    const tokens = text.split(/\s+/);

    // ~ If the current chunk has more tokens than the maximum token count,
    //   push the current chunk to the chunks array and reset the chunk.
    if (tokenCount + tokens.length > maxTokenCount) {
      if (chunk.length > 0 && doesNeedToUpdate) {
        chunks.push(chunk);
      }

      // ~ Reset the chunk and token count.
      doesNeedToUpdate = false;
      chunk = [];
      tokenCount = 0;
    }

    // ~ If the current block has been updated, set the flag to `true`.
    doesNeedToUpdate = doesNeedToUpdate || updateInfo[(block as typeof block & { _id: string })._id];

    // ~ Push the current block to the current chunk.
    chunk.push({
      _id: (block as typeof block & { _id: string })._id,
      text,
    });

    // ~ Increment the token count by the number of tokens in the current block.
    tokenCount += tokens.length;
  };

  // ~ Push the last chunk to the chunks array.
  if (chunk.length > 0 && doesNeedToUpdate) {
    chunks.push(chunk);
  }

  return chunks;
};

/**
 * Update the embeds on a page in chunks.
 *
 * @param page The page to update the embeds for.
 * @param pageData The page data of the page that is being updated.
 */

const refreshEmbeds = async (page: string, pageData: IPage) => {
  // ~ Get the maximum number of tokens for one batch.
  const maxTokenCount = +(process.env.MAX_TOKEN_COUNT || 250);

  // ~ Get the latest block update information for the page.
  const updateInfo = await getBlockUpdateInfo(page);

  // ~ Separate the blocks into chunks.
  const chunks = chunkBlocks(pageData.data, maxTokenCount, updateInfo);

  // ~ Remove the block update information for the page from Redis.
  await RedisClient.set(`page:${page}`, JSON.stringify([]));

  // ~ If there are no chunks, return.
  if (chunks.length === 0) {
    return;
  }

  console.log('Updating embeds...');
  console.log(JSON.stringify(chunks, null, 2));
};

export default refreshEmbeds;
