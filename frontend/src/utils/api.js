const BASE = process.env.REACT_APP_API_URL;

async function request(method, path, body) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res; // let callers decide res.ok & res.json()
}

export async function apiGet(path) {
  return request("GET", path);
}

export async function apiPost(path, body) {
  return request("POST", path, body);
}

export async function apiPut(path, body) {
  return request("PUT", path, body);
}

export async function apiDelete(path) {
  return request("DELETE", path);
}

// default export to keep backward-compat (api.get / api.post / api.put / api.delete)
const api = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
};

export default api;
