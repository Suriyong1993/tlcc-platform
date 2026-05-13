import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>สวัสดีตอนเช้า \u{1F64F}</Text>
          <Text style={styles.date}>วันอาทิตย์ที่ 15 มีนาคม 2026</Text>
        </View>
      </View>

      {/* Live Banner */}
      <View style={styles.liveBanner} onTouchEnd={() => router.push('/sermons')}>
        <View style={styles.liveBg}>
          <View style={styles.liveDot} />
          <Text style={styles.liveTitle}>นมัสการวันอาทิตย์</Text>
          <Text style={styles.liveViewers}>248 คนกําลังดู</Text>
        </View>
      </View>

      {/* Daily Verse */}
      <View style={styles.verseCard}>
        <Text style={styles.verseRef}>ยอห์น 3:16</Text>
        <Text style={styles.verseText}>"เพราะว่าพระเจ้าทรงรักโลก จนถึงกับได้ประทานพระบุตรองค์เดียว..."</Text>
      </View>

      {/* Quick Grid */}
      <View style={styles.quickGrid}>
        {[
          { icon: '\u{25B6}', label: 'คําเทศนา', sub: 'ล่าสุด: 08 มี.ค.', color: '#00FF66', route: '/sermons' as const },
          { icon: '\u{1F4C5}', label: 'กิจกรรม', sub: '3 กิจกรรมใกล้มา', color: '#00D0FF', route: '/events' as const },
          { icon: '\u{1F64F}', label: 'อธิษฐาน', sub: '147 คําขอ', color: '#FF6B9D', route: '/prayer' as const },
          { icon: '\u{1F4F0}', label: 'ข่าวสาร', sub: '4 บทความใหม่', color: '#FF9800', route: '/community' as const },
        ].map((item) => (
          <View key={item.label} style={styles.qCard} onTouchEnd={() => router.push(item.route)}>
            <View style={[styles.qIcon, { color: item.color }]}>
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
            </View>
            <Text style={styles.qTitle}>{item.label}</Text>
            <Text style={styles.qSub}>{item.sub}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181A1F' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, paddingBottom: 8 },
  greeting: { fontSize: 20, fontWeight: 'bold', color: '#FFF', fontFamily: 'serif' },
  date: { fontSize: 12, color: '#9599A1' },
  liveBanner: { margin: 16, borderRadius: 20, overflow: 'hidden', backgroundColor: '#0a1a0f', borderWidth: 1, borderColor: 'rgba(0,255,102,0.2)' },
  liveBg: { padding: 16 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF4B4B', marginBottom: 4 },
  liveTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  liveViewers: { fontSize: 12, color: '#9599A1' },
  verseCard: { marginHorizontal: 16, padding: 16, backgroundColor: '#20232A', borderRadius: 18, marginBottom: 8 },
  verseRef: { fontSize: 10, color: '#00FF66', letterSpacing: 1, marginBottom: 8 },
  verseText: { fontSize: 14, color: '#FFF', lineHeight: 24, fontFamily: 'serif' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16 },
  qCard: { width: '48%', backgroundColor: '#20232A', borderRadius: 18, padding: 16 },
  qIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#181A1F', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  qTitle: { fontSize: 14, fontWeight: '600', color: '#FFF', marginBottom: 4 },
  qSub: { fontSize: 12, color: '#9599A1' },
});
