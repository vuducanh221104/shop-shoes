'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { message } from 'antd';
import styles from './page.module.scss';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string | null;
  addresses: {
    $values: Address[];
  };
}

interface Address {
  id: number;
  street: string;
  city: string;
  district: string;
  ward: string;
  country: string;
  isDefault: boolean;
}

export default function AccountProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Hardcoded userId for now - in real app this would come from auth
  const userId = 1;

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
      const userData = response.data;
      
      // Handle addresses from API response
      const addressList = userData.addresses?.$values || [];
      setAddresses(addressList);
      
      setProfile(userData);
      setFormData({
        email: userData.email,
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : ''
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      message.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        dateOfBirth: formData.dateOfBirth || null
      };
      
      await axios.put(`http://localhost:5000/api/users/${userId}`, dataToSubmit);
      message.success('Profile updated successfully');
      setIsEditing(false);
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original profile data
    if (profile) {
      setFormData({
        email: profile.email,
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : ''
      });
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/users/${userId}/addresses`, {
        ...newAddress,
        isDefault: addresses.length === 0
      });
      message.success('Address added successfully');
      setShowAddressForm(false);
      setNewAddress({});
      fetchUserProfile();
    } catch (error) {
      console.error('Error adding address:', error);
      message.error('Failed to add address');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <h1>My Profile</h1>

        <div className={styles.content}>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className={styles.formActions}>
              {!isEditing ? (
                <button
                  type="button"
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className={styles.saveButton}
                    onClick={handleSubmit}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>

          <div className={styles.addresses}>
            <div className={styles.addressesHeader}>
              <h2>My Addresses</h2>
              <button
                className={styles.addAddressButton}
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                {showAddressForm ? 'Cancel' : 'Add New Address'}
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className={styles.addressForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="street">Street</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={newAddress.street || ''}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={newAddress.city || ''}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="district">District</label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={newAddress.district || ''}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="ward">Ward</label>
                  <input
                    type="text"
                    id="ward"
                    name="ward"
                    value={newAddress.ward || ''}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={newAddress.country || ''}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <button type="submit" className={styles.saveButton}>
                  Add Address
                </button>
              </form>
            )}

            <div className={styles.addressList}>
              {addresses.map((address) => (
                <div key={address.id} className={styles.addressCard}>
                  <div className={styles.addressInfo}>
                    <p>{address.street}</p>
                    <p>{`${address.ward}, ${address.district}`}</p>
                    <p>{`${address.city}, ${address.country}`}</p>
                    {address.isDefault && <span className={styles.defaultBadge}>Default</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}