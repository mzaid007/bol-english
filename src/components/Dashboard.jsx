import React, { useState } from 'react';
import { LESSONS } from '../data/curriculum';

export default function Dashboard({ profile, progress, onSelectLesson, onRetakeAssessment }) {
  const [activeTab, setActiveTab] = useState(profile.level || 'beginner');

  const getLevelLabel = (level) => {
    switch (level) {
      case 'beginner': return { text: 'बुनियादी (Beginner)', class: 'beginner' };
      case 'intermediate': return { text: 'मध्यम (Intermediate)', class: 'intermediate' };
      case 'advanced': return { text: 'उच्च (Advanced)', class: 'advanced' };
      default: return { text: 'अनिर्धारित (Unassessed)', class: '' };
    }
  };

  const currentLevelInfo = getLevelLabel(profile.level);
  
  // Calculate completed count for the current active tab
  const getCompletedCount = (level) => {
    const levelLessons = LESSONS[level] || [];
    return levelLessons.filter(l => progress.completedLessons.includes(l.id)).length;
  };

  return (
    <div className="screen app-container">
      {/* User profile card */}
      <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="dashboard-user">
          <div className="user-avatar" aria-hidden="true">
            {profile.avatar || "👤"}
          </div>
          <div>
            <div className="user-greeting">नमस्ते,</div>
            <div className="user-name">{profile.name || "शिक्षार्थी (Learner)"}</div>
            <span className={`level-badge ${currentLevelInfo.class}`}>
              {currentLevelInfo.text}
            </span>
          </div>
        </div>

        {/* Dynamic statistics overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>🔥 {progress.streak || 0}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Streak</div>
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--secondary)' }}>💎 {progress.xp || 0}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Total XP</div>
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--success)' }}>
              {progress.completedLessons.length}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Completed</div>
          </div>
        </div>
      </div>

      {/* Tabs to select level */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
        {['beginner', 'intermediate', 'advanced'].map((lvl) => {
          const isActive = activeTab === lvl;
          const completedCount = getCompletedCount(lvl);
          const totalCount = (LESSONS[lvl] || []).length;
          
          return (
            <button
              key={lvl}
              onClick={() => setActiveTab(lvl)}
              style={{
                flex: 1,
                padding: '12px 4px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
            >
              <div>
                {lvl === 'beginner' && 'बुनियादी'}
                {lvl === 'intermediate' && 'मध्यम'}
                {lvl === 'advanced' && 'उच्च'}
              </div>
              <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px' }}>
                ({completedCount}/{totalCount} Done)
              </div>
            </button>
          );
        })}
      </div>

      {/* Recommended tag if tab matches assessed level */}
      {profile.level === activeTab && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--secondary)', fontWeight: '600', marginBottom: '12px' }}>
          <span>🌟</span>
          <span>आपके लिए अनुशंसित (Recommended for you)</span>
        </div>
      )}

      {/* Lesson List */}
      <div className="lesson-list" style={{ flexGrow: 1 }}>
        {(LESSONS[activeTab] || []).map((lesson) => {
          const isCompleted = progress.completedLessons.includes(lesson.id);
          
          return (
            <div
              key={lesson.id}
              className={`lesson-card ${isCompleted ? 'completed' : ''}`}
              onClick={() => onSelectLesson(lesson, activeTab)}
            >
              <div className="lesson-card-details">
                <h3 className="lesson-card-title">{lesson.titleEnglish}</h3>
                <h4 className="hindi-text" style={{ fontSize: '13px', fontWeight: '400', color: 'var(--text-hindi)', marginBottom: '4px' }}>
                  {lesson.titleHindi}
                </h4>
                <p className="lesson-card-desc hindi-text">{lesson.descriptionHindi}</p>
                <div className="lesson-card-reward">
                  <span>💎</span>
                  <span>+{lesson.xpReward} XP</span>
                </div>
              </div>
              
              <div className="lesson-card-status">
                {isCompleted ? "✓" : "→"}
              </div>
            </div>
          );
        })}
        
        {(LESSONS[activeTab] || []).length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
            इस स्तर में अभी कोई पाठ नहीं हैं।
          </div>
        )}
      </div>

      {/* Retake assessment button */}
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button className="btn btn-secondary" onClick={onRetakeAssessment}>
          🔄 दोबारा स्तर जाँचें (Retake Assessment)
        </button>
      </div>
    </div>
  );
}
