import addBlockQuery from './blocks/addBlockQuery';
import deleteBlockQuery from './blocks/deleteBlockQuery';
import editBlockQuery from './blocks/editBlockQuery';

const queryGenerator = (operations: Record<string, unknown>[]) => {
  const completedOperations = operations.map((operation) => {
    // -=- Add Block -=-
    if (operation.type === 'addBlock') {
      return addBlockQuery(operation.data);
    }

    // -=- Delete Block -=-
    if (operation.type === 'deleteBlock') {
      return deleteBlockQuery(operation.data);
    }

    // -=- Edit Block -=-
    if (operation.type === 'editBlock') {
      return editBlockQuery(operation.data);
    }

    return Promise.resolve({});
  });

  return completedOperations;
};

export default queryGenerator;
