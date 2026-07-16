const ID_TOKEN_KEY = "id_token";
const ID_ROLE_KEY = "user_role";
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

export const getRole = () => {
  return window.localStorage.getItem(ID_ROLE_KEY);
};

export const saveRole = role => {
  window.localStorage.setItem(ID_ROLE_KEY, role);
};

export const destroyRole = () => {
  window.localStorage.removeItem(ID_ROLE_KEY);
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

export default { getToken, saveToken, destroyToken, getRole, saveRole, destroyRole, getSource, saveSource, destroySource};
