import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '../../store/auth';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    if (password.length < 6) {
      Alert.alert('ข้อผิดพลาด', 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }
    try {
      const username = name.trim().replace(/\s+/g, '').toLowerCase();
      await register(email, username, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'ไม่สามารถสมัครสมาชิกได้';
      Alert.alert('เกิดข้อผิดพลาด', Array.isArray(msg) ? msg.join('\n') : msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>สมัครสมาชิก</Text>
      <View style={styles.form}>
        <Text style={styles.label}>ชื่อ-นามสกุล</Text>
        <TextInput style={styles.input} placeholder="สมชาย รักสันติ" placeholderTextColor="#555861"
          value={name} onChangeText={setName} />
        <Text style={styles.label}>อีเมล</Text>
        <TextInput style={styles.input} placeholder="your@email.com" placeholderTextColor="#555861"
          value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Text style={styles.label}>รหัสผ่าน</Text>
        <TextInput style={styles.input} placeholder="อย่างน้อย 6 ตัวอักษร" placeholderTextColor="#555861"
          value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={[styles.btn, isLoading && styles.btnDisabled]} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#181A1F" /> : <Text style={styles.btnText}>สมัครสมาชิก</Text>}
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => router.back()} style={styles.link}>
        <Text style={styles.linkText}>{'\u2190'} กลับไปหน้าเข้าสู่ระบบ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181A1F', padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#00FF66', textAlign: 'center', marginBottom: 24 },
  form: { backgroundColor: '#20232A', borderRadius: 20, padding: 20 },
  label: { fontSize: 12, color: '#9599A1', marginBottom: 6, marginTop: 8 },
  input: { backgroundColor: '#181A1F', color: '#FFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#2A2E37' },
  btn: { backgroundColor: '#00FF66', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#181A1F', fontWeight: '700', fontSize: 16 },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#9599A1', fontSize: 14 },
});
