export default function AdminDashboard() {
  const stats = [
    { label: 'สมาชิก', value: 248, color: '#00FF66' },
    { label: 'คําอธิษฐาน', value: 147, color: '#00D0FF' },
    { label: 'Blog Posts', value: 24, color: '#FF9800' },
    { label: 'รออนุมัติ', value: 5, color: '#FF6B9D' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#20232A] p-6 border-r border-[#2A2E37]">
        <div className="text-xl font-bold text-[#00FF66] mb-8">\u{2699} TLCC Admin</div>
        <nav className="space-y-2">
          {['แดชบอร์ด', 'จัดการสมาชิก', 'กิจกรรม', 'Blog', 'คําอธิษฐาน', 'ตั้งค่า'].map(item => (
            <a key={item} href="#" className="block py-2 px-3 rounded-lg hover:bg-[#181A1F] text-[#9599A1] hover:text-[#00FF66] transition">
              {item}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">แดชบอร์ด</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-[#20232A] rounded-2xl p-6">
              <div className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-sm text-[#9599A1]">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#20232A] rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">กิจกรรมล่าสุด</h2>
          <p className="text-[#9599A1]">Coming soon — connect to backend API</p>
        </div>
      </main>
    </div>
  );
}
