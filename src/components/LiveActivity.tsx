import { useEffect, useState } from 'react';
import { TrendingUp, Trophy, Users, Wallet } from 'lucide-react';

const NAMES = [
  'Mugisha','Uwase','Niyonzima','Habimana','Mukamana','Ishimwe','Nshimiyimana','Mukandayisenga','Munyaneza','Ingabire',
  'Hakizimana','Uwineza','Bizimana','Mukashema','Nzeyimana','Uwimana','Tuyishime','Mukamugema','Rwema','Iradukunda',
  'Niyibizi','Mukantwari','Sebatware','Umutoni','Nshuti','Nyirahabimana','Bigirimana','Mukabaranga','Twagirayezu','Uwizeyimana',
  'Mukamurenzi','Nsengiyumva','Mukandori','Hakorimana','Kayitesi','Twizeyimana','Nyiramana','Uwamahoro','Mugabo','Mukantabana',
  'Nshimirimana','Mukabazungu','Habiyaremye','Mukamusoni','Nizeyimana','Mukasine','Twagiramungu','Uwizeye','Manirakiza','Mukashyaka',
  'Munyemana','Nyirahirwa','Bizumuremyi','Mukantagara','Hagenimana','Umulisa','Twahirwa','Mukamfizi','Rugema','Nyirabageni',
  'Mukandutiye','Nshimiyimana','Iyamuremye','Mukamana','Bagirishya','Uwamariya','Twagirumukiza','Mukantwali','Mucyo','Niyitegeka',
  'Niyonsaba','Mukandayisenga','Tuyizere','Umugwaneza','Habinshuti','Mukasonga','Niyirora','Uwitonze','Munyangabe','Mukamutara',
  'Bizimungu','Mukandayambaje','Hategekimana','Uwitije','Tuyishimire','Mukantaganda','Nzabonimpa','Uwamariya','Habineza','Mukasakindi',
  'Niyibaho','Umutesi','Mukandahiro','Sebahire','Nyiransabimana','Tuyizere','Mukabunani','Nyandwi','Uwambaje','Mugemana',
  'Mukamugisha','Nshimiyimfura','Uwamungu','Bizoza','Mukantarindwa','Hakimana','Uwingabire','Munyandinda','Mukamana','Niyonkuru',
  'Tuyirenge','Mukanyirigira','Habiyambere','Uwizera','Munyentwari','Mukamutesi','Sibomana','Nyiranzeyimana','Mukashema','Twesigye',
  'Uwitware','Nshimiyumukiza','Mukabikino','Hakuzwumuremyi','Niyonzima','Mukanyamibwa','Tuyizere','Uwanyirigira','Munana','Mukamuziga',
  'Bagaza','Niragire','Mukantezimana','Uwituze','Nyirahirwa','Mukandanga','Twagiramungu','Uwizeyimana','Habarurema','Mukandori',
  'Nizeyimana','Mukamuziga','Twizere','Uwimanimpaye','Munyakazi','Mukamutesi','Bizimana','Nyiramana','Mukasine','Hakizimana',
  'Niyibizi','Uwababyeyi','Mukandori','Tuyisenge','Mukamugema','Sebatware','Uwizeyimana','Munyaneza','Mukantabana','Habineza',
  'Twagiramungu','Uwineza','Mukantwari','Bizumuremyi','Niyibaho','Mukamfizi','Hagenimana','Uwamahoro','Mukamana','Twahirwa',
  'Mukandutiye','Nshimirimana','Uwizera','Habiyaremye','Mukasonga','Tuyirenge','Bizimana','Mukamuziga','Hakimana','Uwitonze',
  'Mukamugisha','Niyonsaba','Twesigye','Mukantezimana','Iradukunda','Mukabazungu','Uwingabire','Habinshuti','Mukasakindi','Niyibizi',
  'Tuyizere','Mukamutara','Bizoza','Nyirahabimana','Mukandayisenga','Uwitware','Nshimiyimana','Munyemana','Mukasine','Twizere'
];

// --- Extended pool: 1000 fictional Rwandan investor records with masked phones ---
const SURNAMES = ['Mugisha','Uwase','Niyonzima','Habimana','Mukamana','Ishimwe','Nshimiyimana','Munyaneza','Ingabire','Hakizimana','Uwineza','Bizimana','Mukashema','Nzeyimana','Uwimana','Tuyishime','Rwema','Iradukunda','Niyibizi','Umutoni','Nshuti','Bigirimana','Twagirayezu','Uwizeyimana','Nsengiyumva','Kayitesi','Twizeyimana','Uwamahoro','Mugabo','Nshimirimana','Habiyaremye','Uwizeye','Manirakiza','Munyemana','Twahirwa','Iyamuremye','Bagirishya','Uwamariya','Mucyo','Niyitegeka','Tuyizere','Umugwaneza','Habinshuti','Uwitonze','Bizimungu','Hategekimana','Tuyishimire','Nzabonimpa','Habineza','Niyibaho','Umutesi','Sebahire','Tuyizere','Nyandwi','Uwambaje','Mugemana','Uwamungu','Bizoza','Hakimana','Uwingabire','Niyonkuru','Tuyirenge','Habiyambere','Uwizera','Sibomana','Twesigye','Uwitware','Niyonzima','Uwanyirigira','Bagaza','Niragire','Uwituze','Habarurema','Nizeyimana','Twizere','Uwimanimpaye','Bizimana','Hakizimana','Niyibizi','Uwababyeyi','Uwizeyimana','Habineza','Twagiramungu','Uwineza','Bizumuremyi','Hagenimana','Uwamahoro','Twahirwa','Nshimirimana','Uwizera','Tuyirenge','Bizimana','Hakimana','Uwitonze','Niyonsaba','Twesigye','Iradukunda','Uwingabire','Habinshuti','Niyibizi','Bizoza'];
const GIVEN = ['Jean','Marie','Alphonse','Emmanuel','Claudine','Pascal','Josiane','Fidele','Aline','Vincent','Beatrice','Eric','Chantal','Innocent','Solange','Damascene','Odette','Theogene','Josephine','Patrick','Diane','Bosco','Immaculee','Fabrice','Yvette','Jacques','Christine','Andre','Grace','Olivier','Sandrine','Emile','Justine','Placide','Liliane','Serge','Nadine','Faustin','Berthe','Aimable','Divine','Cyprien','Rachel','Elias','Sarah','Prince','Peace','Angel','Kevin','Sylvie'];
const MOBILE_PREFIXES = ['72','73','78','79'];

function pad2(n: number) { return n < 10 ? '0' + n : String(n); }
function seedRand(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
}
function generateExtendedNames(count: number): string[] {
  const rand = seedRand(20260720);
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const first = GIVEN[Math.floor(rand() * GIVEN.length)];
    const last = SURNAMES[Math.floor(rand() * SURNAMES.length)];
    const prefix = MOBILE_PREFIXES[Math.floor(rand() * MOBILE_PREFIXES.length)];
    const first3 = String(100 + Math.floor(rand() * 900)).slice(0, 3);
    const last2 = pad2(Math.floor(rand() * 100));
    out.push(`${last} ${first[0]}. +2507${prefix.slice(1)}${first3.slice(0,1)}****${last2}`);
  }
  return out;
}
NAMES.push(...generateExtendedNames(1000));

const ACTIONS = [
  { t: 'invested in VIP', amounts: [10000, 20000, 30000, 40000, 50000, 100000, 250000, 500000], icon: TrendingUp, color: 'from-primary to-secondary' },
  { t: 'withdrew', amounts: [5000, 12000, 25000, 40000, 80000, 150000, 300000], icon: Wallet, color: 'from-emerald-500 to-green-500' },
  { t: 'earned daily profit', amounts: [1500, 3000, 6000, 10000, 25000, 50000], icon: Trophy, color: 'from-amber-500 to-orange-500' },
  { t: 'joined', amounts: [0], icon: Users, color: 'from-red-500 to-red-500' },
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
    <div className="mt-4 rounded-2xl bg-gradient-to-br from-primary via-red-500 to-secondary p-4 text-primary-foreground shadow-button">
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
