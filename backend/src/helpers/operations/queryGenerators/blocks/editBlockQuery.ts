interface editBlockQueryProps {
  'doc-ids': string[];
  'block-type': string,
  'block-properties': Record<string, unknown>,
}

const editBlockQuery = async (props: unknown) => {
  const {
    'doc-ids': docIDs,
    'block-type': blockType,
    'block-properties': blockProperties,
  } = props as editBlockQueryProps;

  const arrayFilters: Record<string, unknown>[] = [];
  let queryString = 'data.';

  docIDs.forEach((element, index) => {
    arrayFilters.push({
      [`a${index}._id`]: element,
    });

    if (index < (docIDs.length - 1)) {
      queryString += `$[a${index}].children.`;
      return;
    }

    queryString += `$[a${index}]`;
  });

  return [
    {
      $set: {
        ...(blockType !== undefined && { [`${queryString}.blockType`]: blockType }),
        ...(blockProperties !== undefined && { [`${queryString}.properties`]: blockProperties }),
      },
    },
    arrayFilters,
  ];
};

export default editBlockQuery;
