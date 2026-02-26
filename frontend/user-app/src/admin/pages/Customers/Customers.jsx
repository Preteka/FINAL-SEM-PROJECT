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
                {/* Enhanced Page Header */}
                <div
                    className="admin-section-header"
                    style={{
                        background: 'linear-gradient(135deg, #8d6e63 0%, #5d4037 100%)',
                        padding: '2rem',
                        borderRadius: '12px',
                        color: 'white',
                        marginBottom: '2rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                        animation: 'slideInDown 0.6s ease-out',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}
                >
                    <div>
                        <h2 style={{ color: 'white', marginBottom: '0.4rem', fontSize: '1.75rem' }}>Users & Customers</h2>
                        <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                            <i className="fas fa-users-cog me-2"></i> Manage registered community members
                        </p>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <i className="fas fa-search" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#8d6e63' }}></i>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '0.75rem 1rem 0.75rem 2.8rem',
                                border: 'none',
                                borderRadius: '10px',
                                minWidth: '300px',
                                outline: 'none',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                fontSize: '0.95rem'
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
                                {filteredUsers.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        style={{
                                            animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                                        }}
                                    >
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                <div style={{
                                                    width: '36px', height: '36px', borderRadius: '50%',
                                                    background: '#efebe9', color: '#8d6e63',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.9rem', fontWeight: 'bold',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                    border: '1px solid #d7ccc8'
                                                }}>
                                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <span style={{ fontWeight: '600', color: '#1e293b' }}>{user.name || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td>{user.email || 'N/A'}</td>
                                        <td>
                                            <span
                                                className={`status-badge ${user.role === 'admin' ? 'status-delivered' : 'status-pending'}`}
                                                style={{
                                                    background: user.role === 'admin' ? '#8d6e63' : '#efebe9',
                                                    color: user.role === 'admin' ? 'white' : '#5d4037'
                                                }}
                                            >
                                                {user.role || 'User'}
                                            </span>
                                        </td>
                                        <td>{user.phone || 'N/A'}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                                <button
                                                    className="action-btn"
                                                    title="View Details"
                                                    onClick={() => handleViewDetails(user)}
                                                    style={{ color: '#8d6e63' }}
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    title="Delete User"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                            No users found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes slideInDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }

                .admin-modal {
                    animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .admin-table tr {
                    transition: all 0.2s ease;
                }

                .admin-table tr:hover {
                    background-color: #fdfaf9 !important;
                    transform: scale(1.002);
                }

                .action-btn {
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                .action-btn:hover {
                    transform: scale(1.2);
                }
            `}</style>

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

