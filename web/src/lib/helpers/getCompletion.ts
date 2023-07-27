import crypto from 'crypto';

/**
 * Get the completion for a block
 * @returns The completion
 */
const getCompletion = async (
  blockIndex: number,
): Promise<string> => (
  new Promise((resolve, reject) => {
    const eventID = crypto.randomBytes(12).toString('hex');

    document.dispatchEvent(
      new CustomEvent('completionRequest', {
        detail: {
          blockIndex,
          eventID,
        },
      })
    );

    const handleCompletion = (event: CustomEvent<{ completion: string, eventID: string }>) => {
      if (eventID !== event.detail.eventID) return;

      document.removeEventListener('completion', handleCompletion as EventListener);

      resolve(event.detail.completion);
    };

    setTimeout(() => {
      document.removeEventListener('completion', handleCompletion as EventListener);
      reject('Failed to get completion in time');
    }, 1000);

    document.addEventListener('completion', handleCompletion as EventListener);
  })
);

export default getCompletion;
