import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { api } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

export const RolesScreen = () => {
  const [roles, setRoles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin()) {
      loadRoles();
    }
  }, [isAdmin]);

  const loadRoles = async () => {
    try {
      const response = await api.get('/api/roles');
      setRoles(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load roles');
    }
  };

  const handleSave = async () => {
    try {
      if (editingRole) {
        await api.put(`/api/roles/${editingRole._id}`, formData);
      } else {
        await api.post('/api/roles', formData);
      }
      await loadRoles();
      setModalVisible(false);
      resetForm();
      Alert.alert('Success', editingRole ? 'Role updated' : 'Role created');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save');
    }
  };

  const resetForm = () => {
    setEditingRole(null);
    setFormData({ name: '', description: '' });
  };

  const openModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({ name: role.name, description: role.description || '' });
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Roles</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={roles}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.roleCard} onPress={() => openModal(item)}>
            <Text style={styles.roleName}>{item.name}</Text>
            <Text style={styles.roleDescription}>{item.description || 'No description'}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingRole ? 'Edit Role' : 'Add Role'}</Text>

            <TextInput style={styles.input} placeholder="Name (Admin or Employee)" value={formData.name} onChangeText={text => setFormData({ ...formData, name: text })} />
            <TextInput style={styles.input} placeholder="Description" value={formData.description} onChangeText={text => setFormData({ ...formData, description: text })} multiline />

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
  roleCard: { backgroundColor: '#fff', margin: 8, padding: 16, borderRadius: 8 },
  roleName: { fontSize: 18, fontWeight: '600', marginBottom: 4, color: '#4CAF50' },
  roleDescription: { fontSize: 14, color: '#666' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', margin: 20, padding: 24, borderRadius: 12 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  cancelButton: { flex: 1, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8, marginRight: 8, alignItems: 'center' },
  cancelButtonText: { color: '#666', fontWeight: '600' },
  saveButton: { flex: 1, padding: 12, backgroundColor: '#4CAF50', borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: '600' },
});

