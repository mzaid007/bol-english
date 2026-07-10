import React from 'react';
import McqQuestion from './McqQuestion';
import ReorderQuestion from './ReorderQuestion';
import ListeningQuestion from './ListeningQuestion';
import SpeechQuestion from './SpeechQuestion';

/**
 * Renders the interactive body of any question/quiz item based on its `type`.
 * Handles: vocab | mcq | grammar | reorder | listening | speech
 * (vocab, mcq, grammar all render as MCQ.)
 *
 * Used by both the Assessment and the Lesson practice phases.
 *
 * props:
 *  - question: the question object from curriculum.js
 *  - speech:   the shared useSpeech() instance (required for listening/speech types)
 *  - onResolved: (isCorrect) => void
 */
export default function QuestionBody({ question, speech, onResolved }) {
  if (!question) return null;

  switch (question.type) {
    case 'vocab':
    case 'mcq':
    case 'grammar':
      return (
        <McqQuestion
          options={question.options}
          correctAnswer={question.correctAnswer}
          onResolved={onResolved}
        />
      );

    case 'reorder':
      return (
        <ReorderQuestion
          words={question.words}
          correctAnswer={question.correctAnswer}
          onResolved={onResolved}
        />
      );

    case 'listening':
      return (
        <ListeningQuestion
          audioText={question.audioText}
          options={question.options}
          correctAnswer={question.correctAnswer}
          onResolved={onResolved}
          speak={speech?.speak}
          isSpeaking={speech?.isSpeaking}
        />
      );

    case 'speech':
      return (
        <SpeechQuestion
          speechText={question.speechText}
          onResolved={onResolved}
          speech={speech}
        />
      );

    default:
      return null;
  }
}
