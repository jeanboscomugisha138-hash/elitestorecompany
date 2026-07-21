import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Shield, Users, Sparkles, Target, Ship } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import petaneLogo from '@/assets/petane-logo.png';

const values = [
  {
    icon: Globe,
    title: 'Gukorera mu mucyo',
    desc: 'Dushyira imbere gutanga amakuru asobanutse afasha abakoresha gusobanukirwa serivisi n’amahitamo bafite.',
  },
  {
    icon: Shield,
    title: 'Umutekano n’uburinzi bw’amakuru',
    desc: 'Twita ku kurinda amakuru y’abakoresha no gukoresha uburyo bufasha kubungabunga umutekano w’urubuga.',
  },
  {
    icon: Users,
    title: 'Korohereza abakoresha',
    desc: 'Twubaka urubuga rworoshye gukoresha, rutuma abakoresha babona amakuru kandi bagakurikirana ibikorwa byabo mu buryo bworoshye.',
  },
  {
    icon: Sparkles,
    title: 'Iterambere rihoraho',
    desc: 'Dukomeza kunoza serivisi zacu dukurikije ibitekerezo by’abakoresha ndetse n’impinduka z’ikoranabuhanga.',
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-[hsl(0_0%_96%)]">
      {/* Header */}
      <div className="gradient-primary px-4 pt-4 pb-20 relative">
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center active:scale-95 transition"
          >
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </Link>
          <div className="text-primary-foreground text-center">
            <h1 className="text-lg font-black tracking-tight">Abo Turi Bo</h1>
          </div>
          <div className="w-10" />
        </div>
        <div className="flex flex-col items-center mt-5">
          <div className="w-16 h-16 rounded-2xl bg-primary-foreground flex items-center justify-center shadow-lg">
            <img src={petaneLogo} alt="Petane Shipping" className="h-10 w-auto" />
          </div>
          <p className="text-primary-foreground/90 text-xs font-bold mt-2 tracking-widest uppercase">PETANE SHIPPING</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 -mt-14 relative z-10 space-y-4">
        {/* Intro card */}
        <div className="bg-card rounded-2xl shadow-card border border-border/40 p-5">
          <h2 className="text-[15px] font-black text-foreground leading-tight mb-3">
            MENYA NEZA PETANE SHIPPING
          </h2>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Petane Shipping ni urubuga rwa sosiyete ikorera mu rwego rwa marine logistics n’ubwikorezi bwo mu nyanja, rugamije gutanga amahirwe yo kwitabira ibikorwa bifitanye isano n’iterambere ry’ubucuruzi n’ishoramari.
          </p>
          <p className="text-[13px] text-muted-foreground leading-relaxed mt-3">
            Sosiyete yatangijwe mu mwaka wa 1997 muri Leta Zunze Ubumwe za Amerika, ikaba yaragiye ikura igera ku rwego mpuzamahanga ikorera mu bihugu bitandukanye ku isi hose. Kugeza ubu, ifite umuryango mugari w’abakozi n’abafatanyabikorwa barenga 10,000 ku isi hose, bagira uruhare mu guteza imbere ibikorwa byayo.
          </p>
          <p className="text-[13px] text-muted-foreground leading-relaxed mt-3">
            Mu rwego rwo kugeza amahirwe ku bantu benshi, Petane Shipping yatangiye ibikorwa byayo mu Rwanda muri Werurwe 2026, igamije gufasha abantu kubona uburyo bushya bwo kwiteza imbere binyuze mu gukoresha ikoranabuhanga no kubona amakuru ajyanye na serivisi zitangwa.
          </p>
        </div>

        {/* Vision card */}
        <div className="bg-card rounded-2xl shadow-card border border-border/40 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-primary" strokeWidth={2.3} />
            </div>
            <h3 className="text-[15px] font-black text-foreground">Icyerekezo cyacu mu Rwanda</h3>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Petane Shipping yiyemeje gukorera mu Rwanda mu gihe cy’imyaka 3, aho izakomeza gutanga serivisi no guteza imbere abakoresha bayo mbere yo kwagurira ibikorwa mu kindi gihugu hakurikijwe gahunda y’iterambere rya sosiyete.
          </p>
        </div>

        {/* Values card */}
        <div className="bg-card rounded-2xl shadow-card border border-border/40 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Ship className="w-5 h-5 text-primary" strokeWidth={2.3} />
            </div>
            <h3 className="text-[15px] font-black text-foreground">Indangagaciro zacu</h3>
          </div>
          <div className="space-y-4">
            {values.map((v, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <v.icon className="w-4 h-4 text-primary" strokeWidth={2.3} />
                </div>
                <div>
                  <h4 className="text-[13px] font-black text-foreground">{v.title}</h4>
                  <p className="text-[12px] text-muted-foreground leading-relaxed mt-0.5">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How we work card */}
        <div className="bg-card rounded-2xl shadow-card border border-border/40 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" strokeWidth={2.3} />
            </div>
            <h3 className="text-[15px] font-black text-foreground">Uko dukora</h3>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Abakoresha bashobora kureba ibisobanuro birambuye bya buri gahunda cyangwa serivisi mbere yo gufata icyemezo. Intego yacu ni uko buri mukoresha agira amakuru ahagije kandi agasobanukirwa neza n’ibyo ahitamo.
          </p>
          <p className="text-[13px] text-muted-foreground leading-relaxed mt-3">
            Petane Shipping ikomeje kubaka urubuga ruhuza ikoranabuhanga, umutekano n’imikoreshereze yoroshye kugira ngo itange uburambe bwiza ku bakoresha bayo.
          </p>
        </div>

        {/* Footer note */}
        <div className="text-center pt-2 pb-4">
          <p className="text-[10px] text-muted-foreground font-semibold">
            PETANE SHIPPING · Kigali, Rwanda · 1997 – {new Date().getFullYear()}
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
