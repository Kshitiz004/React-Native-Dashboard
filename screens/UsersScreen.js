import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { api } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

export const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', contact: '', roles: [] });
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin()) {
      loadUsers();
      loadRoles();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    }
  };

  const loadRoles = async () => {
    try {
      const response = await api.get('/api/roles');
      setRoles(response.data.map(role => role.name));
    } catch (error) {
      console.error('Failed to load roles', error);
      // Fallback to default roles if API fails
      setRoles(['Admin', 'Employee']);
    }
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await api.put(`/api/users/${editingUser._id}`, formData);
      } else {
        await api.post('/api/users', { ...formData, password: 'default123' });
      }
      await loadUsers();
      setModalVisible(false);
      resetForm();
      Alert.alert('Success', editingUser ? 'User updated' : 'User created');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save');
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    const defaultRole = roles.length > 0 ? roles[0] : 'Employee';
    setFormData({ name: '', email: '', contact: '', roles: [defaultRole] });
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, contact: user.contact || '', roles: user.roles || [] });
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const toggleRole = (role) => {
    const newRoles = formData.roles.includes(role)
      ? formData.roles.filter(r => r !== role)
      : [...formData.roles, role];
    setFormData({ ...formData, roles: newRoles });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Users</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userCard} onPress={() => openModal(item)}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <Text style={styles.userRoles}>{item.roles?.join(', ') || 'No roles'}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingUser ? 'Edit User' : 'Add User'}</Text>

            <TextInput style={styles.input} placeholder="Name" value={formData.name} onChangeText={text => setFormData({ ...formData, name: text })} />
            <TextInput style={styles.input} placeholder="Email" value={formData.email} onChangeText={text => setFormData({ ...formData, email: text })} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Contact" value={formData.contact} onChangeText={text => setFormData({ ...formData, contact: text })} />

            <View style={styles.roleSection}>
              <Text style={styles.roleLabel}>Roles:</Text>
              <View style={styles.roleChipsContainer}>
                {roles.map(role => (
                  <TouchableOpacity key={role} style={[styles.roleChip, formData.roles.includes(role) && styles.roleChipActive]} onPress={() => toggleRole(role)}>
                    <Text style={[styles.roleChipText, formData.roles.includes(role) && styles.roleChipTextActive]}>{role}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => { setModalVisible(false); resetForm(); }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold' },
  addButton: { backgroundColor: '#4CAF50', padding: 8, borderRadius: 8, paddingHorizontal: 16 },
  addButtonText: { color: '#fff', fontWeight: '600' },
  userCard: { backgroundColor: '#fff', margin: 8, padding: 16, borderRadius: 8 },
  userName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#666', marginBottom: 4 },
  userRoles: { fontSize: 12, color: '#4CAF50' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', margin: 20, padding: 24, borderRadius: 12 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  roleSection: { marginVertical: 12 },
  roleLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  roleChipsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  roleChip: { backgroundColor: '#f0f0f0', padding: 8, borderRadius: 8, marginRight: 8, marginBottom: 8 },
  roleChipActive: { backgroundColor: '#4CAF50' },
  roleChipText: { fontSize: 12, color: '#666' },
  roleChipTextActive: { color: '#fff' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  cancelButton: { flex: 1, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8, marginRight: 8, alignItems: 'center' },
  cancelButtonText: { color: '#666', fontWeight: '600' },
  saveButton: { flex: 1, padding: 12, backgroundColor: '#4CAF50', borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: '600' },
});





