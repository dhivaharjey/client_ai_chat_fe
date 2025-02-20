export const setItemLocalStorage = (name, value) => {
  return localStorage.setItem(name, JSON.stringify(value));
};
export const getItemLocalStorage = (name) => {
  return JSON.parse(localStorage.getItem(name));
};
export const removeItemLocalStorage = (name) => {
  return localStorage.removeItem(name);
};
