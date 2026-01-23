export const getStats = (req, res) => {
    res.json([
        { title: 'Total Orders', value: '0' },
        { title: 'Pending Orders', value: '0' },
        { title: 'Delivered Orders', value: '0' },
        { title: 'Total Revenue', value: '₹0' }
    ]);
};

export const getLatestOrders = (req, res) => {
    res.json([]);
};

export const getActivity = (req, res) => {
    res.json([]);
};
