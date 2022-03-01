interface PageDataInterface {
  status: string,
  message: {
    blockID: string,
    blockType: string,
    properties: Record<string, unknown>,
    style: Record<string, unknown>,
  }[],
}

export default PageDataInterface;
