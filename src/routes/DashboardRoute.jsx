import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LESSONS } from '../data/curriculum';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import StatChip from '../components/ui/StatChip';
import Badge from '../components/ui/Badge';

const LEVEL_LABELS = {
  beginner: { text: 'बुनियादी (Beginner)', class: 'beginner' },
  intermediate: { text: 'मध्यम (Intermediate)', class: 'intermediate' },
  advanced: { text: 'उच्च (Advanced)', class: 'advanced' },
};

const GOAL_RECOMMENDATIONS = {
  career: {
    title: "नौकरी और व्यवसाय मार्ग (Career & Job Pathway)",
    desc: "इंटरव्यू और ऑफिस में संवाद करने के लिए ये पाठ सबसे महत्वपूर्ण हैं:",
    lessons: [
      { id: "b3", title: "Introducing Yourself", level: "beginner" },
      { id: "a1", title: "Job Interview", level: "advanced" },
      { id: "a5", title: "Public Speaking", level: "advanced" }
    ]
  },
  speaking: {
    title: "दैनिक बोलचाल मार्ग (Daily Conversation Pathway)",
    desc: "दूसरों से बातचीत शुरू करने और अंग्रेजी बोलने का डर दूर करने के लिए:",
    lessons: [
      { id: "b2", title: "Greetings & Manners", level: "beginner" },
      { id: "b3", title: "Introducing Yourself", level: "beginner" },
      { id: "i1", title: "At a Restaurant", level: "intermediate" }
    ]
  },
  travel: {
    title: "यात्रा और घूमना मार्ग (Travel Pathway)",
    desc: "सफर के दौरान सवाल पूछने, ऑर्डर देने और दिशा पूछने के लिए:",
    lessons: [
      { id: "i1", title: "At a Restaurant", level: "intermediate" },
      { id: "i2", title: "Asking for Directions", level: "intermediate" },
      { id: "a4", title: "Conversational Idioms", level: "advanced" }
    ]
  },
  education: {
    title: "शिक्षा और परीक्षा मार्ग (Education Pathway)",
    desc: "बुनियादी ग्रामर और सवालों की संरचना मजबूत करने के लिए:",
    lessons: [
      { id: "b1", title: "Alphabet & Words", level: "beginner" },
      { id: "i3", title: "Tenses in Daily Life", level: "intermediate" },
      { id: "i5", title: "Asking Questions", level: "intermediate" }
    ]
  }
};

export default function DashboardRoute() {
  const navigate = useNavigate();
  const { profile, progress } = useApp();
  const [activeTab, setActiveTab] = useState(profile.level || 'beginner');

  const levelInfo = LEVEL_LABELS[profile.level] || { text: 'अनिर्धारित (Unassessed)', class: 'muted' };

  const getCompletedCount = (lvl) => {
    const list = LESSONS[lvl] || [];
    return list.filter((l) => progress.completedLessons.includes(l.id)).length;
  };

  return (
    <div className="app-container page">
      {/* Profile Card */}
      <Card className="mb-20">
        <div className="dashboard-user">
          <div className="user-avatar" aria-hidden="true">
            {profile.avatar || '🧑‍🎓'}
          </div>
          <div>
            <div className="user-greeting">नमस्ते,</div>
            <div className="user-name">{profile.name || 'शिक्षार्थी'}</div>
            <Badge variant={levelInfo.class} className="mt-4">
              {levelInfo.text}
            </Badge>
          </div>
        </div>

        {/* Stats Row */}
        <div className="dashboard-stats mt-16 pt-16" style={{ borderTop: '1px solid var(--border)' }}>
          <StatChip icon="🔥">{progress.streak || 0} Streak</StatChip>
          <StatChip icon="💎">{progress.xp || 0} XP</StatChip>
          <StatChip icon="✅">{progress.completedLessons.length} Completed</StatChip>
        </div>
      </Card>

      {/* Goal Pathway Recommendation Card */}
      {profile.goal && GOAL_RECOMMENDATIONS[profile.goal] && (
        <Card className="mb-20" style={{ borderLeft: '4px solid var(--accent)', background: 'var(--accent-soft)' }}>
          <p className="bold text-xs secondary mb-4 uppercase tracking-wider" style={{ color: 'var(--accent)', fontSize: 10 }}>
            🎯 आपके लक्ष्य के लिए अनुशंसित (Recommended for Your Goal)
          </p>
          <h3 className="text-sm bold mb-6" style={{ color: 'var(--text)' }}>
            {GOAL_RECOMMENDATIONS[profile.goal].title}
          </h3>
          <p className="text-xs text-secondary mb-12 hindi-text" style={{ fontSize: 13, lineHeight: 1.4 }}>
            {GOAL_RECOMMENDATIONS[profile.goal].desc}
          </p>
          <div className="row gap-8 flex-wrap">
            {GOAL_RECOMMENDATIONS[profile.goal].lessons.map((rec) => {
              const isDone = progress.completedLessons.includes(rec.id);
              return (
                <button
                  key={rec.id}
                  onClick={() => {
                    setActiveTab(rec.level);
                    navigate(`/lesson/${rec.id}`);
                  }}
                  className="btn-icon"
                  style={{
                    padding: '8px 12px',
                    fontSize: 12,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    color: isDone ? 'var(--success)' : 'var(--text)',
                  }}
                >
                  <span>{isDone ? '✅' : '📖'}</span>
                  <span>{rec.title}</span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="dashboard-tabs">
        {['beginner', 'intermediate', 'advanced'].map((lvl) => {
          const isActive = activeTab === lvl;
          const done = getCompletedCount(lvl);
          const total = (LESSONS[lvl] || []).length;
          return (
            <button
              key={lvl}
              onClick={() => setActiveTab(lvl)}
              className={`tab-btn ${isActive ? 'active' : ''}`}
            >
              <div>
                {lvl === 'beginner' && 'बुनियादी'}
                {lvl === 'intermediate' && 'मध्यम'}
                {lvl === 'advanced' && 'उच्च'}
              </div>
              <div className="tab-btn-sub">({done}/{total} Done)</div>
            </button>
          );
        })}
      </div>

      {/* Recommended recommendation badge */}
      {profile.level === activeTab && (
        <div className="row gap-6 mb-12 text-sm bold" style={{ color: 'var(--accent)' }}>
          <span>🌟</span>
          <span>आपके लिए अनुशंसित (Recommended for you)</span>
        </div>
      )}

      {/* Lesson List */}
      <div className="lesson-list grow">
        {(LESSONS[activeTab] || []).map((lesson) => {
          const isDone = progress.completedLessons.includes(lesson.id);
          return (
            <div
              key={lesson.id}
              className={`lesson-card ${isDone ? 'completed' : ''}`}
              onClick={() => navigate(`/lesson/${lesson.id}`)}
            >
              <div className="lesson-card-details">
                <h3 className="lesson-card-title">{lesson.titleEnglish}</h3>
                <h4 className="hindi-text" style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  {lesson.titleHindi}
                </h4>
                <p className="lesson-card-desc hindi-text">{lesson.descriptionHindi}</p>
                <div className="lesson-card-reward">
                  <span>💎</span>
                  <span>+{lesson.xpReward} XP</span>
                </div>
              </div>
              <div className="lesson-card-status bold">
                {isDone ? '✓' : '→'}
              </div>
            </div>
          );
        })}
        {(LESSONS[activeTab] || []).length === 0 && (
          <div className="center muted py-40 text-sm">इस स्तर में अभी कोई पाठ नहीं हैं।</div>
        )}
      </div>

      {/* Retake Assessment */}
      <div className="mt-24">
        <Button variant="secondary" onClick={() => navigate('/assessment')}>
          🔄 दोबारा स्तर जाँचें (Retake Assessment)
        </Button>
      </div>
    </div>
  );
}
