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
    data: {
      blockID: string,
      blockType: string,
      properties: Record<string, unknown>,
      style: Record<string, unknown>,
    }[]
  },
}

export default PageDataInterface;
