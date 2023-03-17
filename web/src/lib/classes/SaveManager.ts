class SaveManager {
  private static instance: SaveManager;

  private saveData: {
    [key: string]: {
      type: string,
      data: unknown,
    }[],
  } = {};

  private pageSaveData: {
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

  public static save(type: string, data: unknown, page: string, isPageEdit = false) {
    const saveManager = SaveManager.getInstance();

    if (!isPageEdit) {
      if (!saveManager.saveData[page]) {
        saveManager.saveData[page] = [];
      }

      SaveManager.getInstance().saveData[page].push({
        type,
        data,
      });
      return;
    }

    if (!saveManager.pageSaveData[page]) {
      saveManager.pageSaveData[page] = [];
    }

    SaveManager.getInstance().pageSaveData[page].push({
      type,
      data,
    });
  }

  public static async sendToServer() {
    const saveManager = SaveManager.getInstance();
    const { saveData, pageSaveData } = saveManager;

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

    Object.keys(pageSaveData).forEach(async (page) => {
      const data = pageSaveData[page];

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
        saveManager.pageSaveData[page] = [];
      }
    });
  }
}

export default SaveManager;
