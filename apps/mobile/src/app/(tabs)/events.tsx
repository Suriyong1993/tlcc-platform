import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const events = [
  {
    id: 1, title: 'สัมมนาครอบครัวคริสเตียน', category: 'Family', date: '15 MAR 2026',
    time: '13:00 – 16:00 น.', location: 'ห้องประชุมใหญ่',
    capacity: 'รับสมัคร 50 คน · เหลือ 12 ที่นั่ง',
    color: '#00FF66', icon: '👥', regText: '#00FF66',
  },
  {
    id: 2, title: 'ค่ายอนุชน One Day 2026', category: 'Youth', date: '22 MAR 2026',
    time: '09:00 – 17:00 น.', location: 'ค่ายลูกเสือจังหวัดกาฬสินธุ์',
    capacity: 'อายุ 15–25 ปี · เปิดรับ',
    color: '#00D0FF', icon: '🏕️', regText: '#00D0FF',
  },
  {
    id: 3, title: 'นมัสการคืนวันศุกร์', category: 'Worship', date: '28 MAR 2026',
    time: '18:00 – 21:00 น.', location: 'อาคารหลัก',
    capacity: 'เปิดรับทั่วไป',
    color: '#FF6B9D', icon: '🎵', regText: '#FF6B9D',
  },
];

const generateCalendar = () => {
  const days = [];
  // March 2026 starts on Sunday
  const prevDays = [23, 24, 25, 26, 27, 28];
  const eventDays = new Set([15, 22, 30]);
  const today = 10;
  const selected = 15;

  for (const d of prevDays) days.push({ day: d, other: true, hasEvent: false, isToday: false, isSelected: false });
  for (let i = 1; i <= 31; i++) {
    days.push({
      day: i,
      other: false,
      hasEvent: eventDays.has(i),
      isToday: i === today,
      isSelected: i === selected,
    });
  }
  return days;
};

export default function EventsScreen() {
  const [selectedDay, setSelectedDay] = useState(15);
  const calDays = generateCalendar();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>กิจกรรม</Text>
      </View>

      {/* Calendar */}
      <View style={styles.calWrap}>
        <View style={styles.calNav}>
          <Text style={styles.calMonth}>มีนาคม 2026</Text>
          <View style={styles.calArrows}>
            <TouchableOpacity style={styles.calArrow}><Text style={styles.arrowText}>◀</Text></TouchableOpacity>
            <TouchableOpacity style={styles.calArrow}><Text style={styles.arrowText}>▶</Text></TouchableOpacity>
          </View>
        </View>
        <View style={styles.calHeader}>
          {['อา','จ','อ','พ','พฤ','ศ','ส'].map(d => (
            <Text key={d} style={styles.dayHeader}>{d}</Text>
          ))}
        </View>
        <View style={styles.calGrid}>
          {calDays.map((d, i) => (
            <TouchableOpacity key={i} style={[styles.dayCell, d.isSelected && styles.daySelected, d.isToday && styles.dayToday]}
              onPress={() => setSelectedDay(d.day)}>
              <Text style={[styles.dayText, d.other ? { color: '#9599A166' } : { color: '#FFF' },
                (d.isSelected || d.isToday) && { color: '#181A1F', fontWeight: '700' }]}>{d.day}</Text>
              {d.hasEvent && !d.isSelected && (
                <View style={styles.eventDot} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Event Cards */}
      <View style={styles.sectionTitle}>
        <Text style={styles.sectionText}>กิจกรรมที่กำลังมา</Text>
      </View>
      <View style={styles.eventList}>
        {events.map(ev => (
          <View key={ev.id} style={styles.eventCard}>
            <View style={[styles.eventImg, { backgroundColor: ev.color + '22' }]}>
              <Text style={{ fontSize: 40, opacity: 0.3 }}>{ev.icon}</Text>
              <View style={[styles.dateChip, { backgroundColor: ev.color }]}>
                <Text style={[styles.dateChipText, { color: '#181A1F' }]}>{ev.date}</Text>
              </View>
              <View style={styles.catChip}>
                <Text style={styles.catText}>{ev.category}</Text>
              </View>
            </View>
            <View style={styles.eventBody}>
              <Text style={styles.eventTitle}>{ev.title}</Text>
              <View style={styles.eventDetail}><Text style={styles.detailIcon}>🕐</Text><Text style={styles.detailText}>{ev.time}</Text></View>
              <View style={styles.eventDetail}><Text style={styles.detailIcon}>📍</Text><Text style={styles.detailText}>{ev.location}</Text></View>
              <View style={styles.eventDetail}><Text style={styles.detailIcon}>👥</Text><Text style={styles.detailText}>{ev.capacity}</Text></View>
              <TouchableOpacity style={[styles.regBtn, { borderColor: ev.regText, color: ev.regText }]}>
                <Text style={[styles.regBtnText, { color: ev.regText }]}>{'✅ '} ลงทะเบียน</Text>
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
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFF', fontFamily: 'serif' },
  calWrap: { marginHorizontal: 16, marginBottom: 16, backgroundColor: '#20232A', borderRadius: 20, padding: 16 },
  calNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  calMonth: { fontSize: 15, fontWeight: '600', color: '#FFF' },
  calArrows: { flexDirection: 'row', gap: 8 },
  calArrow: { width: 32, height: 32, borderRadius: 50, backgroundColor: '#181A1F', alignItems: 'center', justifyContent: 'center' },
  arrowText: { fontSize: 10, color: '#9599A1' },
  calHeader: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 4 },
  dayHeader: { fontSize: 10, color: '#9599A1', width: 40, textAlign: 'center', fontFamily: 'monospace' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', gap: 4 },
  dayCell: { width: 40, height: 40, borderRadius: 50, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  daySelected: { backgroundColor: '#00FF66' },
  dayToday: { backgroundColor: 'rgba(0,255,102,0.15)' },
  dayText: { fontSize: 13 },
  eventDot: { position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: 4, backgroundColor: '#00FF66' },
  sectionTitle: { paddingHorizontal: 16, marginBottom: 8 },
  sectionText: { fontSize: 12, color: '#9599A1', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace' },
  eventList: { paddingHorizontal: 16, paddingBottom: 80 },
  eventCard: { backgroundColor: '#20232A', borderRadius: 18, marginBottom: 16, overflow: 'hidden' },
  eventImg: { height: 110, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  dateChip: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  dateChipText: { fontSize: 11, fontWeight: '700' },
  catChip: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)' },
  catText: { fontSize: 10, color: '#FFF' },
  eventBody: { padding: 16 },
  eventTitle: { fontSize: 16, fontWeight: '600', color: '#FFF', marginBottom: 10 },
  eventDetail: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  detailIcon: { fontSize: 10, width: 12 },
  detailText: { fontSize: 12, color: '#9599A1' },
  regBtn: { width: '100%', padding: 14, borderRadius: 12, backgroundColor: '#181A1F', borderWidth: 1, marginTop: 12, alignItems: 'center' },
  regBtnText: { fontSize: 15, fontWeight: '600' },
});
