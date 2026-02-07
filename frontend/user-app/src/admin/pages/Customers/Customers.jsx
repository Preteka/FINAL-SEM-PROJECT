import React, { useEffect, useState } from 'react';
import AdminHeader from '../../components/Header/Header';
import { useUsers } from '../../hooks/useUsers';
import { db } from '../../../shared/services/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const Customers = () => {
    const { users, loading, error, fetchUsers } = useUsers();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setShowViewModal(true);
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteDoc(doc(db, "users", id));
                alert("User deleted successfully!");
                fetchUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user.");
            }
        }
    };

    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="admin-content">Loading users...</div>;
    if (error) return <div className="admin-content" style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;


    return (
        <>
            <AdminHeader title="User Management" />
            <div className="admin-content">
                <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2>Users</h2>
                        <p>Manage registered customers.</p>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '0.65rem 1rem 0.65rem 2.5rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                minWidth: '250px',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <div className="admin-table-container">
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Phone</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                    background: '#e2e8f0', color: '#64748b',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.8rem', fontWeight: 'bold'
                                                }}>
                                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <span style={{ fontWeight: '500', color: '#1e293b' }}>{user.name || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td>{user.email || 'N/A'}</td>
                                        <td>
                                            <span className={`status-badge ${user.role === 'admin' ? 'status-low' : 'status-delivered'}`}>
                                                {user.role || 'User'}
                                            </span>
                                        </td>
                                        <td>{user.phone || 'N/A'}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                                                <button className="action-btn" title="View Details" onClick={() => handleViewDetails(user)}>
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="action-btn delete" title="Delete User" onClick={() => handleDeleteUser(user.id)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* View User Modal */}
            {showViewModal && selectedUser && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '500px' }}>
                        <div className="admin-modal-header">
                            <h3>User Details</h3>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '50%',
                                    background: '#f1f5f9', color: '#64748b',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.5rem', fontWeight: 'bold', border: '2px solid #e2e8f0'
                                }}>
                                    {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{selectedUser.name || 'N/A'}</h2>
                                    <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>{selectedUser.role || 'Customer'}</p>
                                </div>
                            </div>

                            <div className="info-grid" style={{ gridTemplateColumns: '1fr' }}>
                                <div className="info-item" style={{ marginBottom: '1rem' }}>
                                    <span className="label">Email Address</span>
                                    <span className="value">{selectedUser.email || 'N/A'}</span>
                                </div>
                                <div className="info-item" style={{ marginBottom: '1rem' }}>
                                    <span className="label">Phone Number</span>
                                    <span className="value">{selectedUser.phone || 'Not Provided'}</span>
                                </div>
                                <div className="info-item" style={{ marginBottom: '1rem' }}>
                                    <span className="label">Address</span>
                                    <span className="value">
                                        {selectedUser.address ? (
                                            <>
                                                {selectedUser.address.street && <div>{selectedUser.address.street}</div>}
                                                {selectedUser.address.city && <div>{selectedUser.address.city}, {selectedUser.address.zip || ''}</div>}
                                                {selectedUser.address.state && <div>{selectedUser.address.state}</div>}
                                            </>
                                        ) : 'No address saved'}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="label">User ID (Firestore)</span>
                                    <span className="value" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{selectedUser.id}</span>
                                </div>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Customers;

