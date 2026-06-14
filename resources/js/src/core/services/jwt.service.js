const ID_TOKEN_KEY = "id_token";
const selected_source="selected_source";

export const getToken = () => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

export const saveToken = token => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};
export const getSource = () => {
  return window.localStorage.getItem(selected_source);
};

export const saveSource = source => {
  window.localStorage.setItem(selected_source, source);
};

export const destroySource = () => {
  window.localStorage.removeItem(selected_source);
};

export default { getToken, saveToken, destroyToken, getSource, saveSource, destroySource};
