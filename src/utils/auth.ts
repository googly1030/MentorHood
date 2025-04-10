interface User {
  username: string;
  email: string;
  role: string;
  token?: string;
}

export const setUserData = (userData: User) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export const getUserData = (): User | null => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const removeUserData = () => {
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!getUserData();
};

export const loginUser = async (email: string, password: string) => {
  const response = await fetch('http://localhost:9000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  setUserData(data);
  return data;
};

export const logoutUser = () => {
  removeUserData();
};