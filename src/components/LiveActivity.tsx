import { useEffect, useState } from 'react';
import { TrendingUp, Trophy, Users, Wallet } from 'lucide-react';

// Fictional investor identities. None of these names is used by a real member.
const SURNAMES = [
  'Bizimungu','Semugeshi','Rwigema','Gahima','Kankindi','Habonimana','Sinayiko','Kanyangezi',
  'Rugwiro','Mbonabucya','Niyibigenkerwa','Sebera','Busingye','Nshimiyimfura','Mukabandana',
  'Nyirabaganwa','Uwingabiye','Munyabagisha','Rukara','Gisaro','Bishya','Muganga','Nshobora',
  'Habarugira','Seburikoko','Nyirandayisabye','Kanyamukama','Rugemantaba','Mukamureshabyi',
  'Ndayishemye','Gashugi','Bimenyimana','Nyirandobanani','Mukandiramwe','Rugwiza',
  'Habiyakare','Sebahinzi','Nkuranga','Butoyi','Mukashonga','Bwiza','Kanyemba','Habinshuti',
];

const GIVEN = [
  'Kanyike','Ndahindurwa','Mukashumba','Rukoma','Gashayija','Ndayambaje','Sebagabo',
  'Nyirandukwe','Kiribagabo','Mucurangezi','Nyirandayobera','Bwatsi','Kanyamata','Ruganzu',
  'Ndagano','Butoyi','Mukashonga','Bwiza','Kanyemba','Sebera','Busingye','Gisaro','Bishya',
  'Muganga','Nshobora','Habinshuti','Mukabandana','Rukara','Munyabagisha','Nshimiyimfura',
  'Kankindi','Rugwiro','Mbonabucya','Habonimana','Sinayiko','Kanyangezi','Niyibigenkerwa',
  'Semugeshi','Rwigema','Gahima','Nyirabaganwa','Uwingabiye','Nyirandayisabye','Kanyamukama',
  'Rugemantaba','Mukamureshabyi','Ndayishemye','Gashugi','Bimenyimana','Nyirandobanani',
  'Mukandiramwe','Rugwiza','Habiyakare','Sebahinzi','Nkuranga','Bizimungu',
];

const MOBILE_PREFIXES = ['72','73','78','79'];

function seedRand(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
}

function pad3(n: number) { return String(n % 1000).padStart(3, '0'); }

// Builds the feed identities: a short plain-name set plus a large masked-phone set.
function buildNames(count: number): string[] {
  const rand = seedRand(20261106);
  const out: string[] = [];
  const used = new Set<string>();
  while (out.length < count) {
    const first = GIVEN[Math.floor(rand() * GIVEN.length)];
    const last = SURNAMES[Math.floor(rand() * SURNAMES.length)];
    const key = `${last}|${first}`;
    if (used.has(key)) continue;
    used.add(key);
    if (out.length < 120) {
      out.push(`${last} ${first}`);
    } else {
      const prefix = MOBILE_PREFIXES[Math.floor(rand() * MOBILE_PREFIXES.length)];
      out.push(`${last} ${first[0]}. 07${prefix[1]}***${pad3(Math.floor(rand() * 1000))}`);
    }
  }
  return out;
}

const NAMES = buildNames(1000);

const ACTIONS = [
  { t: 'invested in VIP', amounts: [10000, 20000, 30000, 40000, 50000, 100000, 250000, 500000], icon: TrendingUp, color: 'from-primary to-secondary' },
  { t: 'withdrew', amounts: [5000, 12000, 25000, 40000, 80000, 150000, 300000], icon: Wallet, color: 'from-emerald-500 to-green-500' },
  { t: 'earned daily profit', amounts: [1500, 3000, 6000, 10000, 25000, 50000], icon: Trophy, color: 'from-amber-500 to-amber-500' },
  { t: 'joined', amounts: [0], icon: Users, color: 'from-amber-500 to-amber-500' },
];

function randomActivity() {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const amount = action.amounts[Math.floor(Math.random() * action.amounts.length)];
  const seconds = Math.floor(Math.random() * 50) + 1;
  return { name, action, amount, seconds, id: Math.random() };
}

export function LiveActivity() {
  const [item, setItem] = useState(randomActivity());

  useEffect(() => {
    const id = setInterval(() => setItem(randomActivity()), 3000);
    return () => clearInterval(id);
  }, []);

  const Icon = item.action.icon;
  const initial = item.name.charAt(0).toUpperCase();

  return (
    <div className="mt-5 rounded-2xl bg-card border border-primary/15 shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <h3 className="text-sm font-bold text-foreground">Live Investor Activity</h3>
        </div>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Rwanda</span>
      </div>
      <div key={item.id} className="flex items-center gap-3 px-4 py-3 animate-fade-in">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.action.color} flex items-center justify-center text-primary-foreground font-bold shadow-button shrink-0`}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground truncate">
            <span className="font-bold">{item.name}</span>{' '}
            <span className="text-muted-foreground">{item.action.t}</span>
            {item.amount > 0 && <span className="font-bold text-primary"> {item.amount.toLocaleString()} RWF</span>}
          </p>
          <p className="text-[11px] text-muted-foreground">{item.seconds}s ago · verified</p>
        </div>
        <Icon className="w-4 h-4 text-secondary shrink-0" />
      </div>
    </div>
  );
}

export function CompanyAchievements() {
  const items = [
    { label: 'Active Investors', value: '128,450+' },
    { label: 'Total Paid Out', value: '4.2B RWF' },
    { label: 'Years Trusted', value: '5+' },
    { label: 'Success Rate', value: '99.8%' },
  ];
  return (
    <div className="mt-4 rounded-2xl bg-gradient-to-br from-primary via-amber-500 to-secondary p-4 text-primary-foreground shadow-button">
      <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
        <Trophy className="w-4 h-4" /> Our Achievements
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map((it) => (
          <div key={it.label} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-lg font-extrabold">{it.value}</p>
            <p className="text-[11px] opacity-90">{it.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
