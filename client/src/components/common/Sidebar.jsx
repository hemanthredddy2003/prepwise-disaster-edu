import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useState } from 'react';

const NAV = [
  { section: 'MAIN', items: [
    { to: '/dashboard',  label: 'Dashboard',   icon: '🏠' },
    { to: '/alerts',     label: 'Alerts',       icon: '🚨', badgeColor: '#EF4444' },
    { to: '/shelters',   label: 'Shelters',     icon: '🏕️' },
    { to: '/family-plan',label: 'Family Plan',  icon: '👨‍👩‍👧' },
    { to: '/emergency-action', label: 'Emergency Action', icon: '⚡' },
  ]},
  { section: 'LEARN', items: [
    { to: '/courses',      label: 'Courses',      icon: '📚' },
    { to: '/quiz',         label: 'Quiz',         icon: '📝' },
    { to: '/drills',       label: 'Drills',       icon: '🔔' },
    { to: '/certificates', label: 'Certificates', icon: '🏆' },
  ]},
  { section: 'ACCOUNT', items: [
    { to: '/profile', label: 'Profile', icon: '👤' },
    { to: '/admin',   label: 'Admin',   icon: '📊' },
  ]},
];

export default function Sidebar() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const w = collapsed ? 60 : 220;

  return (
    <aside style={{
      width: w, minHeight: '100vh',
      background: '#1a1f2e',
      borderRight: '1px solid #2d3748',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, zIndex: 100,
      transition: 'width 0.2s ease', overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '16px 14px', borderBottom: '1px solid #2d3748', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 60 }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🛡️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.05em' }}>PREPWISE</div>
              <div style={{ fontSize: 9, color: '#64748b', letterSpacing: '0.15em' }}>EDU SYSTEM</div>
            </div>
          </div>
        )}
        {collapsed && <span style={{ fontSize: 20, margin: '0 auto' }}>🛡️</span>}
        <button onClick={() => setCollapsed(c => !c)} style={{
          width: 22, height: 22, borderRadius: 4, background: '#2d3748',
          border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{collapsed ? '→' : '←'}</button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {NAV.map(({ section, items }) => (
          <div key={section}>
            {!collapsed && (
              <div style={{ fontSize: 9, color: '#475569', letterSpacing: '0.15em', padding: '12px 14px 4px', textTransform: 'uppercase', fontWeight: 600 }}>{section}</div>
            )}
            {items.map(({ to, label, icon, badgeColor }) => (
              <NavLink key={to} to={to} style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '10px 0' : '9px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                textDecoration: 'none',
                background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                color: isActive ? '#93c5fd' : '#94a3b8',
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s',
              })}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                {!collapsed && <span>{label}</span>}
                {!collapsed && badgeColor && (
                  <span style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: badgeColor, animation: 'pulse 2s infinite' }} />
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: collapsed ? '12px 8px' : '12px 14px', borderTop: '1px solid #2d3748' }}>
        {!collapsed ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {(user?.name || 'U')[0].toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</div>
                <div style={{ fontSize: 9, color: '#3b82f6', textTransform: 'uppercase' }}>{user?.role || 'user'}</div>
              </div>
            </div>
            <button onClick={() => { dispatch(logout()); navigate('/login'); }} style={{
              width: '100%', padding: '6px', background: 'transparent',
              border: '1px solid #374151', borderRadius: 6,
              color: '#6b7280', fontSize: 11, cursor: 'pointer',
            }}>Sign Out</button>
          </>
        ) : (
          <button onClick={() => { dispatch(logout()); navigate('/login'); }} style={{
            width: 36, height: 36, borderRadius: 6, background: 'transparent',
            border: '1px solid #374151', color: '#6b7280', cursor: 'pointer', fontSize: 14, margin: '0 auto', display: 'block',
          }}>↩</button>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </aside>
  );
}
