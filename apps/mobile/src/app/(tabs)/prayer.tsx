import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

const prayers = [
  { id: 1, name: 'นามแฝง A', text: 'ขออธิษฐานเพื่อพ่อที่ป่วยอยู่ในโรงพยาบาล ขอให้พระเจ้าทรงรักษาให้หายโดยเร็ว', time: '2 นาทีที่แล้ว', category: 'สุขภาพ', prayCount: 12, hearts: 5 },
  { id: 2, name: 'นามแฝง B', text: 'ขออธิษฐานเพื่อโอกาสในการทำงาน กำลังมองหางานใหม่ ขอพระเจ้าทรงนำทาง', time: '15 นาทีที่แล้ว', category: 'การงาน', prayCount: 8, hearts: 3 },
  { id: 3, name: 'นามแฝง C', text: 'ขออธิษฐานเพื่อครอบครัวที่เผชิญปัญหา ขอพระเจ้าทรงให้กำลังใจ', time: '1 ชม.ที่แล้ว', category: 'ครอบครัว', prayCount: 15, hearts: 9 },
];

export default function PrayerScreen() {
  const [request, setRequest] = useState('');
  const [prayCount, setPrayCount] = useState(147);
  const [activeCat, setActiveCat] = useState('ทั้งหมด');
  const categories = ['ทั้งหมด', 'สุขภาพ', 'ครอบครัว', 'การเงิน', 'การงาน'];

  const handleSend = () => {
    if (!request.trim()) return;
    setPrayCount(c => c + 1);
    setRequest('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ห้องอธิษฐาน</Text>
        <Text style={styles.subtitle}>ส่งคำขอและอธิษฐานเพื่อพี่น้อง</Text>
      </View>

      {/* Live Counter */}
      <View style={styles.counterWrap}>
        <View style={styles.counterRing}>
          <Text style={styles.counterNum}>{prayCount}</Text>
          <Text style={styles.counterSub}>คำขอ</Text>
        </View>
        <View>
          <Text style={styles.counterTitle}>Live Prayer Wall 🙏</Text>
          <Text style={styles.counterDesc}>อัปเดตแบบ Realtime{'\n'}เชื่อมต่อผ่าน Supabase</Text>
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catWrap}>
        {categories.map(cat => (
          <TouchableOpacity key={cat}
            style={[styles.catBtn, activeCat === cat && { backgroundColor: 'rgba(0,255,102,0.15)', color: '#00FF66' }]}
            onPress={() => setActiveCat(cat)}>
            <Text style={[styles.catText, activeCat === cat && { color: '#00FF66' }]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Prayer Form */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>✉️ ส่งคำขออธิษฐาน</Text>
        <Text style={styles.label}>หมวดหมู่</Text>
        <View style={styles.inputWrap}>
          <Text style={styles.inputText}>สุขภาพ / การรักษา</Text>
        </View>
        <Text style={styles.label}>รายละเอียด *</Text>
        <TextInput style={[styles.input, styles.textArea]}
          placeholder="ขออธิษฐานเพื่อ..." placeholderTextColor="#555861"
          value={request} onChangeText={setRequest} multiline numberOfLines={3} />
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>แสดงแบบสาธารณะ (ไม่ระบุชื่อ)</Text>
          <TouchableOpacity style={[styles.toggle, { backgroundColor: 'rgba(0,255,102,0.15)' }]}>
            <View style={[styles.toggleKnob, { left: 23, backgroundColor: '#00FF66' }]} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>🚀 ส่งคำขอ</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Prayers */}
      <View style={styles.sectionTitle}>
        <Text style={styles.sectionText}>คำขออธิษฐานล่าสุด</Text>
      </View>
      <View style={styles.prayerList}>
        {prayers.map(p => (
          <View key={p.id} style={styles.prayerCard}>
            <View style={styles.prayerTop}>
              <View style={styles.prayerAvatar}><Text style={{ fontSize: 12, color: '#9599A1' }}>👤</Text></View>
              <Text style={styles.prayerName}>{p.name}</Text>
              <Text style={styles.prayerTime}>{p.time}</Text>
              <View style={[styles.prayerCat, p.category === 'การงาน' && { backgroundColor: 'rgba(255,152,0,0.15)', color: '#FF9800' }]}>
                <Text style={{ fontSize: 10 }}>{p.category}</Text>
              </View>
            </View>
            <Text style={styles.prayerText}>{p.text}</Text>
            <View style={styles.prayerActions}>
              <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#181A1F', borderRadius: 8 }}>
                <Text style={{ color: '#00FF66', fontSize: 12 }}>🙏 อธิษฐานแล้ว ({p.prayCount})</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#181A1F', borderRadius: 8, marginLeft: 8 }}>
                <Text style={{ color: '#9599A1', fontSize: 12 }}>❤️ ({p.hearts})</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181A1F' },
  header: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFF', fontFamily: 'serif', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#9599A1' },
  counterWrap: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#20232A', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  counterRing: { width: 70, height: 70, borderRadius: 50, backgroundColor: '#181A1F', alignItems: 'center', justifyContent: 'center' },
  counterNum: { fontSize: 20, fontWeight: 'bold', color: '#00FF66', fontFamily: 'monospace' },
  counterSub: { fontSize: 10, color: '#9599A1' },
  counterTitle: { fontSize: 15, fontWeight: '600', color: '#FFF', marginBottom: 4 },
  counterDesc: { fontSize: 12, color: '#9599A1' },
  catWrap: { paddingLeft: 16, marginBottom: 16, flexDirection: 'row' },
  catBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 50, backgroundColor: '#20232A', marginRight: 8 },
  catText: { fontSize: 12, color: '#9599A1' },
  formCard: { marginHorizontal: 16, marginBottom: 16, backgroundColor: '#20232A', borderRadius: 20, padding: 20 },
  formTitle: { fontSize: 14, fontWeight: '600', color: '#FFF', marginBottom: 16 },
  label: { fontSize: 12, color: '#9599A1', marginBottom: 6 },
  inputWrap: { backgroundColor: '#181A1F', borderRadius: 14, padding: 14, marginBottom: 16 },
  inputText: { color: '#9599A1', fontSize: 14 },
  input: { backgroundColor: '#181A1F', borderRadius: 14, padding: 14, color: '#FFF', fontSize: 14, marginBottom: 16, minHeight: 80 },
  textArea: { textAlignVertical: 'top' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  toggleLabel: { fontSize: 13, color: '#9599A1' },
  toggle: { width: 44, height: 24, borderRadius: 12, position: 'relative' },
  toggleKnob: { position: 'absolute', width: 18, height: 18, borderRadius: 50, top: 3 },
  sendBtn: { backgroundColor: '#20232A', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#00FF66', color: '#00FF66' },
  sendBtnText: { color: '#00FF66', fontWeight: '600', fontSize: 15 },
  sectionTitle: { paddingHorizontal: 16, marginBottom: 8 },
  sectionText: { fontSize: 12, color: '#9599A1', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace' },
  prayerList: { paddingHorizontal: 16, gap: 12, paddingBottom: 80 },
  prayerCard: { backgroundColor: '#20232A', borderRadius: 16, padding: 14, marginBottom: 12 },
  prayerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  prayerAvatar: { width: 28, height: 28, borderRadius: 50, backgroundColor: '#181A1F', alignItems: 'center', justifyContent: 'center' },
  prayerName: { flex: 1, fontSize: 13, fontWeight: '600', color: '#FFF' },
  prayerTime: { fontSize: 10, color: '#9599A1' },
  prayerCat: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: 'rgba(0,255,102,0.15)' },
  prayerText: { fontSize: 13, color: '#9599A1', lineHeight: 20, marginBottom: 10 },
  prayerActions: { flexDirection: 'row', gap: 8 },
});
