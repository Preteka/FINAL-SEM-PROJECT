// Basic auth service placeholder
export const login = async (credentials) => {
    console.log('Login attempt', credentials);
    return { success: true, user: { role: 'admin' } };
};

export const logout = () => {
    console.log('Logout');
};
