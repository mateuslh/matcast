import { useState } from 'react';
import { CeconiNav } from '../components/ceconi/CeconiNav.jsx';
import { LiveHero, LiveSection, LiveTicker } from '../components/ceconi/LiveExperience.jsx';
import { AboutSection, CeconiFooter, ClipsSection, ReplaySection, ScheduleSection } from '../components/ceconi/CeconiSections.jsx';
import { CheckoutModal, LessonModal, StudentDashboard, useStudentAccess } from '../components/ceconi/StudentExperience.jsx';
import { replays } from '../data/ceconi.js';
import { useCameraStatus, useElapsedTime } from '../hooks/useCameraStream.js';

export function CeconiPage() {
  const { online, status } = useCameraStatus();
  const elapsed = useElapsedTime(online);
  const { access, hasAccess, buyLesson, subscribe, addClip } = useStudentAccess();
  const [checkout, setCheckout] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  const openLesson = lesson => {
    if (hasAccess(lesson)) setActiveLesson(lesson);
    else setCheckout({ lesson, defaultMode: 'single' });
  };

  const finishCheckout = mode => {
    const lesson = checkout?.lesson;
    if (mode === 'monthly') subscribe();
    else if (lesson) buyLesson(lesson.id);
    setCheckout(null);
    if (lesson) setActiveLesson(lesson);
  };

  return (
    <>
      <CeconiNav online={online} status={status} subscribed={access.subscribed} />
      <main>
        <LiveHero online={online} status={status} elapsed={elapsed} />
        <LiveTicker />
        <LiveSection online={online} status={status} elapsed={elapsed} />
        <StudentDashboard access={access} lessons={replays} hasAccess={hasAccess} onOpenLesson={openLesson} onSubscribe={() => setCheckout({ lesson: null, defaultMode: 'monthly' })} />
        <ReplaySection access={access} hasAccess={hasAccess} onOpenLesson={openLesson} />
        <ClipsSection clips={access.clips} />
        <ScheduleSection online={online} />
        <AboutSection />
      </main>
      <CeconiFooter />
      {checkout && <CheckoutModal lesson={checkout.lesson} defaultMode={checkout.defaultMode} onClose={() => setCheckout(null)} onComplete={finishCheckout} />}
      {activeLesson && <LessonModal lesson={activeLesson} clips={access.clips} onClose={() => setActiveLesson(null)} onCreateClip={addClip} />}
    </>
  );
}
