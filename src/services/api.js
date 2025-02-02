const API_BASE_URL = 'https://knowledgebase-django-api.onrender.com/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Token ${token}` } : {};
};

const fetchAPI = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return response.json();
};

export const login = async (username, password) => {
  return await fetchAPI('/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

export const register = async (username, email, password) => {
  return await fetchAPI('/register/', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
};

export const getNotebooks = async () => await fetchAPI('/notebooks/');

export const createNotebook = async (name) => {
  return await fetchAPI('/notebooks/', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
};

export const updateNotebook = async (id, data) => {
  return await fetchAPI(`/notebooks/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteNotebook = async (id) => {
  return await fetchAPI(`/notebooks/${id}/`, {
    method: 'DELETE',
  });
};

export const getCategories = async () => await fetchAPI('/categories/');

export const createCategory = async (data) => {
  return await fetchAPI('/categories/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateCategory = async (id, data) => {
  return await fetchAPI(`/categories/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteCategory = async (id) => {
  return await fetchAPI(`/categories/${id}/`, {
    method: 'DELETE',
  });
};

export const getArticles = async () => await fetchAPI('/articles/');

export const getArticle = async (id) => await fetchAPI(`/articles/${id}/`);

export const createArticle = async (data) => {
  return await fetchAPI('/articles/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateArticle = async (id, data) => {
  return await fetchAPI(`/articles/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteArticle = async (id) => {
  return await fetchAPI(`/articles/${id}/`, {
    method: 'DELETE',
  });
};

export const getComments = async (articleId) => {
  return await fetchAPI(`/comments/?article=${articleId}`);
};

export const createComment = async (articleId, text) => {
  return await fetchAPI('/comments/', {
    method: 'POST',
    body: JSON.stringify({ article: articleId, text }),
  });
};
