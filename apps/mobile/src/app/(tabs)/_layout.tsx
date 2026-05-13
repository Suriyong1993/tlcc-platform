import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <Text style={{ fontSize: 10, fontWeight: focused ? '700' : '400', color: focused ? '#00FF66' : '#9599A1' }}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#20232A', borderTopWidth: 1, borderTopColor: '#2A2E37' },
        tabBarActiveTintColor: '#00FF66',
        tabBarInactiveTintColor: '#9599A1',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'หน้าหลัก',
          title: 'หน้าหลัก',
          tabBarIcon: ({ focused }) => <TabIcon icon="\u{1F3E0}" label="หน้าหลัก" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="sermons"
        options={{
          tabBarLabel: 'Sermon',
          title: 'Sermon',
          tabBarIcon: ({ focused }) => <TabIcon icon="\u{1F3A7}" label="Sermon" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          tabBarLabel: 'กิจกรรม',
          title: 'กิจกรรม',
          tabBarIcon: ({ focused }) => <TabIcon icon="\u{1F4C5}" label="กิจกรรม" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          tabBarLabel: 'Blog',
          title: 'Blog',
          tabBarIcon: ({ focused }) => <TabIcon icon="\u{1F4F0}" label="Blog" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          tabBarLabel: 'อธิษฐาน',
          title: 'อธิษฐาน',
          tabBarIcon: ({ focused }) => <TabIcon icon="\u{1F64F}" label="อธิษฐาน" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
