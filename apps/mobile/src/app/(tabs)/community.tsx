import { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';

const blogs = [
  { id: 1, type: 'testimony', typeLabel: 'ประจักษ์พยาน', title: 'พระเจ้าทรงดีเสมอ เรื่องราวที่เปลี่ยนชีวิต', excerpt: 'ตั้งแต่ฉันมาร่วมคริสตจักรนี้เมื่อ 3 ปีก่อน ชีวิตเปลี่ยนแปลงไปอย่างสิ้นเชิง...', author: 'น.ส.มาลี', date: '10 มี.ค. 2026', readTime: '3 นาที', cat: '#00FF66' },
];

const gridPosts = [
  { id: 2, type: 'ข่าว', title: 'ค่าย Youth 2026 ประสบความสำเร็จ', read: '2 นาที · 05 มี.ค.', color: '#00D0FF', icon: '📰' },
  { id: 3, type: 'บทความ', title: '5 วิธีอธิษฐานที่มีประสิทธิภาพ', read: '5 นาที · 01 มี.ค.', color: '#FF9800', icon: '📖' },
  { id: 4, type: 'เทศนา', title: 'พระคริสต์ทรงฟื้นคืนพระชนม์', read: '8 นาที · 28 ก.พ.', color: '#FF6B9D', icon: '✝️' },
  { id: 5, type: 'ประจักษ์พยาน', title: 'พระเจ้าทรงรักษาโรคฉัน', read: '4 นาที · 25 ก.พ.', color: '#00FF66', icon: '💚' },
];

export default function CommunityScreen() {
  const [activeCat, setActiveCat] = useState('ทั้งหมด');
  const cats = ['ทั้งหมด', 'ข่าวสาร', 'เทศนา', 'บทความ', 'ประจักษ์พยาน'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ข่าวสาร & Blog</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Category Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catWrap}>
        {cats.map(cat => (
          <TouchableOpacity key={cat}
            style={[styles.catChip, activeCat === cat && { backgroundColor: cat === 'ทั้งหมด' ? '#00FF66' : getCatBg(cat), borderColor: getCatBorder(cat) }]}
            onPress={() => setActiveCat(cat)}>
            <Text style={[styles.catText, activeCat === cat && { color: cat === 'ทั้งหมด' ? '#181A1F' : getCatTextColor(cat) }]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notification Banner */}
      <View style={styles.notifBanner}>
        <Text style={{ fontSize: 16 }}>🔔</Text>
        <Text style={styles.notifText}>บทความใหม่ 4 ชิ้นรอคุณอยู่!</Text>
      </View>

      {/* Featured Blog */}
      {blogs.map(blog => (
        <View key={blog.id} style={styles.featBlog}>
          <View style={styles.featImg}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800' }} style={styles.featBg} />
            <View style={styles.featOverlay}>
              <Text style={[styles.featBadge, { backgroundColor: blog.cat }]}>{blog.typeLabel}</Text>
              <Text style={styles.featTitle}>{blog.title}</Text>
            </View>
          </View>
          <View style={styles.featBody}>
            <Text style={styles.featExcerpt}>{blog.excerpt}</Text>
            <View style={styles.featMeta}>
              <View style={styles.featAvatar}><Text style={{ fontSize: 10 }}>👤</Text></View>
              <Text style={{ fontSize: 11, color: '#9599A1' }}>{blog.author}</Text>
              <Text style={{ fontSize: 11, color: '#9599A1' }}>·</Text>
              <Text style={{ fontSize: 11, color: '#9599A1' }}>{blog.date}</Text>
              <Text style={{ fontSize: 11, color: '#9599A1' }}>·</Text>
              <Text style={{ fontSize: 11, color: '#9599A1' }}>{blog.readTime}</Text>
            </View>
          </View>
        </View>
      ))}

      {/* Blog Grid */}
      <View style={styles.grid}>
        {gridPosts.map(post => (
          <View key={post.id} style={styles.gridCard}>
            <View style={styles.gridImg}>
              <Text style={{ fontSize: 24 }}>{post.icon}</Text>
            </View>
            <View style={styles.gridBody}>
              <Text style={[styles.gridType, { color: post.color }]}>{post.type}</Text>
              <Text style={styles.gridTitle}>{post.title}</Text>
              <Text style={styles.gridRead}>{post.read}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function getCatBg(cat: string) {
  const map: Record<string, string> = { 'ข่าวสาร': 'rgba(0,208,255,0.15)', 'เทศนา': 'rgba(0,208,255,0.15)', 'บทความ': 'rgba(255,152,0,0.15)', 'ประจักษ์พยาน': 'rgba(255,107,157,0.15)' };
  return map[cat] || 'rgba(0,255,102,0.15)';
}

function getCatBorder(cat: string) {
  const map: Record<string, string> = { 'ข่าวสาร': '#00D0FF', 'เทศนา': '#00D0FF', 'บทความ': '#FF9800', 'ประจักษ์พยาน': '#FF6B9D' };
  return map[cat] || '#00FF66';
}

function getCatTextColor(cat: string) {
  const map: Record<string, string> = { 'ข่าวสาร': '#00D0FF', 'เทศนา': '#00D0FF', 'บทความ': '#FF9800', 'ประจักษ์พยาน': '#FF6B9D' };
  return map[cat] || '#00FF66';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181A1F' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFF', fontFamily: 'serif' },
  searchBtn: { width: 36, height: 36, borderRadius: 50, backgroundColor: '#20232A', alignItems: 'center', justifyContent: 'center' },
  catWrap: { paddingLeft: 16, marginBottom: 16, flexDirection: 'row' },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50, marginRight: 8, borderWidth: 1, backgroundColor: 'rgba(0,255,102,0.15)', borderColor: '#00FF66' },
  catText: { fontSize: 12, fontWeight: '500', color: '#00FF66' },
  notifBanner: { marginHorizontal: 16, marginBottom: 16, backgroundColor: 'rgba(0,208,255,0.08)', borderWidth: 1, borderColor: 'rgba(0,208,255,0.2)', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifText: { flex: 1, fontSize: 13, color: '#FFF' },
  featBlog: { marginHorizontal: 16, marginBottom: 16, borderRadius: 20, overflow: 'hidden', backgroundColor: '#20232A' },
  featImg: { height: 160, position: 'relative' },
  featBg: { width: '100%', height: '100%', opacity: 0.5 },
  featOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12 },
  featBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, fontSize: 10, fontWeight: '700', marginBottom: 4, color: '#181A1F', alignSelf: 'flex-start' },
  featTitle: { fontSize: 16, color: '#FFF', fontWeight: '700', fontFamily: 'serif', textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  featBody: { padding: 16 },
  featExcerpt: { fontSize: 13, color: '#9599A1', lineHeight: 22, marginBottom: 12 },
  featMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  featAvatar: { width: 22, height: 22, borderRadius: 50, backgroundColor: 'rgba(0,255,102,0.15)', alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12, paddingBottom: 80 },
  gridCard: { width: '48%', backgroundColor: '#20232A', borderRadius: 16, overflow: 'hidden' },
  gridImg: { height: 80, backgroundColor: '#181A1F', alignItems: 'center', justifyContent: 'center' },
  gridBody: { padding: 10 },
  gridType: { fontSize: 10, fontWeight: '700', marginBottom: 4 },
  gridTitle: { fontSize: 12, fontWeight: '600', color: '#FFF', lineHeight: 16, marginBottom: 4 },
  gridRead: { fontSize: 11, color: '#9599A1' },
});
