interface Block {
  _id: string,
  blockType: string,
  properties: Record<string, unknown>,
  children: Block[]
}

interface PageDataInterface {
  status: string,
  message: {
    style: {
      colour: {
        r: number,
        g: number,
        b: number,
      }
    },
    data: Block[]
  },
}

export default PageDataInterface;
