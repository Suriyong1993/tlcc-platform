import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '../../store/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      Alert.alert('เข้าสู่ระบบไม่สําเร็จ', Array.isArray(msg) ? msg.join('\n') : msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>{'\u26EA'} TLCC</Text>
      <Text style={styles.subtitle}>คริสตจักรชีวิตสุขสันต์</Text>
      <View style={styles.form}>
        <Text style={styles.label}>อีเมล</Text>
        <TextInput style={styles.input} placeholder="your@email.com" placeholderTextColor="#555861"
          value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Text style={styles.label}>รหัสผ่าน</Text>
        <TextInput style={styles.input} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" placeholderTextColor="#555861"
          value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={[styles.btn, isLoading && styles.btnDisabled]} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#181A1F" /> : <Text style={styles.btnText}>เข้าสู่ระบบ</Text>}
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.link}>
        <Text style={styles.linkText}>สมัครสมาชิก</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181A1F', padding: 24, justifyContent: 'center' },
  logo: { fontSize: 40, textAlign: 'center', marginBottom: 4, color: '#00FF66' },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#9599A1', marginBottom: 32 },
  form: { backgroundColor: '#20232A', borderRadius: 20, padding: 20 },
  label: { fontSize: 12, color: '#9599A1', marginBottom: 6, marginTop: 8 },
  input: { backgroundColor: '#181A1F', color: '#FFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#2A2E37' },
  btn: { backgroundColor: '#00FF66', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#181A1F', fontWeight: '700', fontSize: 16 },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#00D0FF', fontSize: 14 },
});
