const HISTORY_KEY = "autoinspect_history";

export const saveToHistory = (result) => {
  const history = getHistory();
  const newEntry = {
    id: Date.now(),
    date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
    ...result,
  };
  
  const updatedHistory = [newEntry, ...history].slice(0, 10);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  window.dispatchEvent(new Event("historyUpdated"));
  return updatedHistory;
};

export const getHistory = () => {
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
  window.dispatchEvent(new Event("historyUpdated"));
  return [];
};