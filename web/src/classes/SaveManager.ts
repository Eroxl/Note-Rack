class SaveManager {
  private static instance: SaveManager;

  private saveData: {
    [key: string]: {
      type: string,
      data: unknown,
    }[],
  } = {};

  static getInstance() {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  public static save(type: string, data: unknown, page: string) {
    const saveManager = SaveManager.getInstance();

    if (!saveManager.saveData[page]) {
      saveManager.saveData[page] = [];
    }

    SaveManager.getInstance().saveData[page].push({
      type,
      data,
    });
  }

  public static async sendToServer() {
    const saveManager = SaveManager.getInstance();
    const { saveData } = saveManager;

    if (!Object.keys(saveData).length) return;

    Object.keys(saveData).forEach(async (page) => {
      const data = saveData[page];

      if (!data.length) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/modify/${page}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          operations: data,
        }),
      });

      if (response.status === 200) {
        saveManager.saveData[page] = [];
      }
    });
  }
}

export default SaveManager;
