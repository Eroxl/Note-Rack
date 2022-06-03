import addBlockQuery from './blocks/addBlockQuery';
import deleteBlockQuery from './blocks/deleteBlockQuery';
import editBlockQuery from './blocks/editBlockQuery';

const queryGenerator = async (operations: Record<string, unknown>[]) => {
  operations.map((operation) => {
    // -=- Add Block -=-
    if (operation.type === 'addBlock') {
      return addBlockQuery(operation);
    }

    // -=- Delete Block -=-
    if (operation.type === 'deleteBlock') {
      return deleteBlockQuery(operation);
    }

    // -=- Edit Block -=-
    if (operation.type === 'editBlock') {
      return editBlockQuery(operation);
    }

    return null;
  });

  return operations;
};

export default queryGenerator;
