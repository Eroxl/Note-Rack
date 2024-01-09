import type BlockState from "../../types/BlockState";

const getBlockById = (blockId: string) => {
  return document.getElementById(`block-${blockId}`)?.firstChild as (HTMLElement | undefined);
}

export default getBlockById;
