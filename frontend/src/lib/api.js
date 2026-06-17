import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, timeout: 30000 });

export const fetchInternships = async () => {
  const { data } = await api.get('/internships');
  return data;
};

export const fetchStats = async () => {
  const { data } = await api.get('/internships/stats');
  return data;
};

export const fetchRecentInternships = async (limit = 12) => {
  const { data } = await api.get(`/internships/recent?limit=${limit}`);
  return data;
};

export const triggerScrape = async () => {
  const { data } = await api.post('/admin/scrape');
  return data;
};

export const fetchScrapeStatus = async () => {
  const { data } = await api.get('/admin/scrape/status');
  return data;
};
