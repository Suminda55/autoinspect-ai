const HISTORY_KEY = "autoinspect_history";

export const getHistory = () => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading history from localStorage:", e);
    return [];
  }
};

export const saveToHistory = (newItem) => {
  try {
    // 1. LocalStorage පිරෙන්නේ නැති වෙන්න Base64 / Heavy images අයින් කිරීම
    const cleanedItem = { ...newItem };
    if (cleanedItem.annotated_image) delete cleanedItem.annotated_image;
    if (cleanedItem.image_base64) delete cleanedItem.image_base64;

    // 2. ID එකක් සහ Date එකක් නැත්නම් එකතු කිරීම
    if (!cleanedItem.id) cleanedItem.id = Date.now();
    if (!cleanedItem.date) cleanedItem.date = new Date().toLocaleDateString();

    const existingHistory = getHistory();
    // 3. අන්තිම Record 10 පමණක් තබා ගැනීම
    const updatedHistory = [cleanedItem, ...existingHistory].slice(0, 10);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    
    // 4. මුළු App එකටම History Update වුණු බව Signal කිරීම
    window.dispatchEvent(new Event("historyUpdated"));
  } catch (error) {
    console.warn("LocalStorage quota full, clearing older items...", error);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify([newItem]));
      window.dispatchEvent(new Event("historyUpdated"));
    } catch (e) {
      console.error("Unable to save to localStorage:", e);
    }
  }
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new Event("historyUpdated"));
  } catch (e) {
    console.error("Error clearing history:", e);
  }
  return [];
};