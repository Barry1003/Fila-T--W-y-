'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { C, UI } from '../../tokens';
import type { TeamMember } from '@/server/team';
import { addTeamMember, removeTeamMember } from '@/server/team-actions';

function initials(name: string, email: string): string {
  const base = (name || email).trim();
  const parts = base.split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || base.slice(0, 2).toUpperCase();
}

function Badge({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span className="inline-flex items-center rounded-full px-2 py-[2px]" style={{ fontFamily: UI, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.04em', color, backgroundColor: bg }}>
      {children}
    </span>
  );
}

export default function ConsoleTeam({ members }: { members: TeamMember[] }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function add() {
    if (busy || !email.trim()) return;
    setBusy(true);
    setNotice(null);
    const res = await addTeamMember(email);
    setBusy(false);
    if (!res.ok) { setNotice(res.message); return; }
    setEmail('');
    setNotice(
      res.alreadyHadAccount
        ? 'Added. They now have console access — it unlocks next time they sign in.'
        : 'Invited. They get console access as soon as they sign up with that email.'
    );
    router.refresh();
  }

  async function remove(m: TeamMember) {
    if (busy) return;
    if (!window.confirm(`Remove ${m.name || m.email} as an admin? They keep their account but lose console access.`)) return;
    setBusy(true);
    setNotice(null);
    const res = await removeTeamMember(m.id);
    setBusy(false);
    if (!res.ok) { setNotice(res.message); return; }
    router.refresh();
  }

  return (
    <div className="console-page flex flex-col gap-5 p-7" style={{ fontFamily: UI }}>
      <div>
        <h1 className="font-semibold m-0 tracking-[-0.02em]" style={{ fontSize: '1.35rem', color: C.charcoal }}>Team</h1>
        <p className="m-[4px_0_0]" style={{ fontSize: '0.78rem', color: 'rgba(43,35,32,0.45)' }}>
          People who can open this console. Anyone you add gets full admin access when they sign in with that email.
        </p>
      </div>

      {/* Add admin */}
      <div className="rounded-lg bg-white p-5 border border-solid border-[rgba(43,35,32,0.07)]">
        <div className="font-semibold mb-3" style={{ fontSize: '0.8rem', color: C.charcoal }}>Add an admin</div>
        <div className="flex gap-2 flex-wrap">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') add(); }}
            placeholder="name@email.com"
            className="flex-1 min-w-[220px] py-2.5 px-3.5 rounded-md box-border"
            style={{ fontFamily: UI, fontSize: '0.875rem', color: C.charcoal, border: '1.5px solid rgba(43,35,32,0.14)', outline: 'none' }}
          />
          <button
            onClick={add}
            disabled={busy || !email.trim()}
            className="rounded-md px-5 py-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: UI, fontSize: '0.8rem', fontWeight: 600, color: C.charcoal, backgroundColor: C.gold, border: 'none' }}
          >
            {busy ? 'Working…' : 'Add admin'}
          </button>
        </div>
        {notice && (
          <div className="mt-3" style={{ fontSize: '0.76rem', color: 'rgba(43,35,32,0.6)', lineHeight: 1.5 }}>{notice}</div>
        )}
      </div>

      {/* Members */}
      <div className="rounded-lg bg-white border border-solid border-[rgba(43,35,32,0.07)] overflow-hidden">
        <div className="font-semibold p-5 pb-3" style={{ fontSize: '0.8rem', color: C.charcoal }}>
          Admins ({members.length})
        </div>
        <div className="flex flex-col">
          {members.map((m, i) => (
            <div
              key={m.id}
              className="flex items-center gap-3.5 px-5 py-3.5"
              style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(43,35,32,0.06)' }}
            >
              <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(122,46,56,0.1)', color: C.maroon, fontFamily: UI, fontSize: '0.72rem', fontWeight: 700 }}>
                {initials(m.name, m.email)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium truncate" style={{ fontSize: '0.86rem', color: C.charcoal }}>{m.name}</span>
                  {m.you && <Badge color={C.teal} bg="rgba(59,138,147,0.12)">You</Badge>}
                  {m.isEnvOwner && <Badge color={C.maroon} bg="rgba(122,46,56,0.1)">Primary owner</Badge>}
                  {!m.active && <Badge color="#8A6818" bg="rgba(212,169,78,0.16)">Invited</Badge>}
                </div>
                <div className="truncate" style={{ fontSize: '0.75rem', color: 'rgba(43,35,32,0.5)' }}>
                  {m.email}{!m.active && ' · gets access on first sign-in'}
                </div>
              </div>
              {m.you || m.isEnvOwner ? (
                <span className="shrink-0" style={{ fontSize: '0.72rem', color: 'rgba(43,35,32,0.28)' }}>
                  {m.isEnvOwner ? 'Locked' : ''}
                </span>
              ) : (
                <button
                  onClick={() => remove(m)}
                  disabled={busy}
                  className="shrink-0 rounded-md px-3 py-1.5 cursor-pointer disabled:opacity-50"
                  style={{ fontFamily: UI, fontSize: '0.72rem', fontWeight: 600, color: '#B03A3A', backgroundColor: 'transparent', border: '1px solid rgba(176,58,58,0.3)' }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: '0.74rem', color: 'rgba(43,35,32,0.4)', lineHeight: 1.6 }}>
        Removing an admin keeps their account and order history — it only takes away console access. Owners set in the
        server configuration (OWNER_EMAIL) are marked “Primary owner” and are managed there.
      </p>
    </div>
  );
}
