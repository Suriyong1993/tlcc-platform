import { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';

const sermons = [
  { id: 1, series: 'ศรัทธาที่เคลื่อนภูเขา', title: 'รากฐานชีวิตที่มั่นคง', pastor: 'ศจ.สมชาย', date: '01 มี.ค. 2026', duration: '38:55', img: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400' },
  { id: 2, series: 'ศรัทธาที่เคลื่อนภูเขา', title: 'พระคุณที่เพียงพอ', pastor: 'อ.ใจดี', date: '22 ก.พ. 2026', duration: '41:30', img: 'https://images.unsplash.com/photo-1470116892389-0de5d9770b2c?w=400' },
  { id: 3, series: 'ชีวิตคริสเตียน', title: 'พลังแห่งการอธิษฐาน', pastor: 'ศจ.สมชาย', date: '15 ก.พ. 2026', duration: '52:08', icon: 'video' },
];

const podcasts = [
  { id: 1, ep: 'EP.12', title: 'ชีวิตคริสเตียนในยุคดิจิทัล', date: '10 มี.ค. 2026', duration: '28:44' },
  { id: 2, ep: 'EP.11', title: 'ครอบครัวที่ตั้งอยู่บนพระเจ้า', date: '03 มี.ค. 2026', duration: '35:20' },
];

const worships = [
  { id: 1, title: 'นมัสการสดุดี — ชุดที่ 1', date: '28 ก.พ. 2026', duration: '1:12:33' },
];

type Tab = 'sermon' | 'podcast' | 'worship';

export default function SermonsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('sermon');
  const [playing, setPlaying] = useState(false);

  const content = {
    sermon: sermons.map(s => (
      <View key={s.id} style={styles.card}>
        {s.img ? (
          <Image source={{ uri: s.img }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, { backgroundColor: '#181A1F', alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontSize: 28 }}>▶</Text>
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.cardSeries}>{s.series}</Text>
          <Text style={styles.cardTitle}>{s.title}</Text>
          <Text style={styles.cardMeta}>{s.date} · {s.pastor}
            <Text style={styles.duration}> {s.duration}</Text>
          </Text>
        </View>
      </View>
    )),
    podcast: podcasts.map(p => (
      <View key={p.id} style={styles.card}>
        <View style={[styles.thumb, { backgroundColor: '#181A1F', alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ fontSize: 32 }}>🎙️</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardSeries, { color: '#00D0FF' }]}>TLCC PODCAST {p.ep}</Text>
          <Text style={styles.cardTitle}>{p.title}</Text>
          <Text style={styles.cardMeta}>{p.date}
            <Text style={styles.duration}> {p.duration}</Text>
          </Text>
        </View>
      </View>
    )),
    worship: worships.map(w => (
      <View key={w.id} style={styles.card}>
        <View style={[styles.thumb, { backgroundColor: '#181A1F', alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ fontSize: 32 }}>🎵</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardSeries, { color: '#FF6B9D' }]}>WORSHIP NIGHT 2026</Text>
          <Text style={styles.cardTitle}>{w.title}</Text>
          <Text style={styles.cardMeta}>{w.date}
            <Text style={styles.duration}> {w.duration}</Text>
          </Text>
        </View>
      </View>
    )),
  };

  return (
    <ScrollView style={styles.container}>
      {/* Featured Player */}
      <View style={styles.playerWrap}>
        <View style={styles.playerImg}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?w=800' }}
            style={styles.playerBg}
          />
          <View style={styles.playerOverlay}>
            <View>
              <Text style={styles.pSeries}>SERIES: ศรัทธาที่เคลื่อนภูเขา</Text>
              <Text style={styles.pTitle}>ก้าวข้ามความกลัวด้วยความเชื่อ</Text>
              <Text style={styles.pPastor}>ศจ.สมชาย รักสันติ · 08 มี.ค. 2026</Text>
            </View>
          </View>
        </View>
        <View style={styles.playerControls}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '38%' }]} />
          </View>
          <View style={styles.ctrlRow}>
            <TouchableOpacity><Text style={styles.ctrlBtn}>⏮</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setPlaying(!playing)}>
              <Text style={[styles.ctrlBtn, styles.playBtn]}>{playing ? '⏸️' : '▶️'}</Text>
            </TouchableOpacity>
            <TouchableOpacity><Text style={styles.ctrlBtn}>⏭</Text></TouchableOpacity>
            <TouchableOpacity><Text style={[styles.ctrlBtn, { color: '#00FF66' }]}>🔁</Text></TouchableOpacity>
            <Text style={styles.pTime}>14:23 / 45:12</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabStrip}>
        {([['sermon', 'คำเทศนา'], ['podcast', 'Podcast'], ['worship', 'นมัสการ']] as [Tab, string][]).map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.tabBtn, activeTab === key && styles.tabBtnActive]}
            onPress={() => setActiveTab(key)}
          >
            <Text style={[styles.tabText, activeTab === key && { color: '#00FF66' }]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.list}>
        {content[activeTab]}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181A1F' },
  playerWrap: { margin: 16, marginTop: 8, backgroundColor: '#20232A', borderRadius: 24, overflow: 'hidden' },
  playerImg: { height: 180, position: 'relative' },
  playerBg: { width: '100%', height: '100%', opacity: 0.4 },
  playerOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16,
    backgroundColor: 'rgba(32,35,42,0.95)' },
  pSeries: { fontSize: 10, color: '#00FF66', letterSpacing: 1, marginBottom: 4 },
  pTitle: { fontSize: 16, color: '#FFF', fontWeight: '700', fontFamily: 'serif', marginBottom: 4 },
  pPastor: { fontSize: 12, color: '#9599A1' },
  playerControls: { padding: 12 },
  progressTrack: { height: 6, backgroundColor: '#181A1F', borderRadius: 3, marginBottom: 12, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#00FF66' },
  ctrlRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  ctrlBtn: { fontSize: 20, color: '#FFF' },
  playBtn: { fontSize: 28 },
  pTime: { marginLeft: 'auto', fontSize: 12, color: '#9599A1', fontFamily: 'monospace' },
  tabStrip: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, backgroundColor: '#181A1F', borderRadius: 50, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 50 },
  tabBtnActive: { backgroundColor: '#20232A' },
  tabText: { fontSize: 13, color: '#9599A1', fontWeight: '500' },
  list: { paddingHorizontal: 16, gap: 12, paddingBottom: 80 },
  card: { backgroundColor: '#20232A', flexDirection: 'row', gap: 12, borderRadius: 16, padding: 10, marginBottom: 12 },
  thumb: { width: 70, height: 70, borderRadius: 12 },
  cardInfo: { flex: 1 },
  cardSeries: { fontSize: 10, color: '#00D0FF', letterSpacing: 1, marginBottom: 4 },
  cardTitle: { fontSize: 14, color: '#FFF', fontWeight: '600', marginBottom: 4 },
  cardMeta: { fontSize: 11, color: '#9599A1' },
  duration: { fontFamily: 'monospace', fontSize: 11 },
});
