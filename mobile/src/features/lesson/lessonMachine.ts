import { create } from 'zustand';
import {
  type LessonDetail,
  type CompleteLessonResponse,
} from '../../api/types';

export type LessonStep = 'hook' | 'cards' | 'simulation' | 'quiz' | 'reward';

export type QuizStatus =
  | 'unanswered'
  | 'first_wrong'
  | 'correct'
  | 'second_wrong';

export interface LessonMachineState {
  // Current active step
  currentStep: LessonStep;

  // Active lesson data
  lesson: LessonDetail | null;

  // Hook step
  hookCountdown: number;
  isHookReady: boolean;

  // Cards step
  currentCardIndex: number;
  revealedKeyTerms: Record<string, boolean>;

  // Simulation step - Choice Scenario
  scenarioStepIndex: number;
  scenarioSelections: Record<number, number>;
  hintsUsed: number;
  hintsRevealed: Record<number, boolean>;

  // Simulation step - Calculator
  calculatorInputs: Record<string, number>;
  calculatorHasInteracted: boolean;

  // Quiz step
  selectedQuizOption: number | null;
  quizStatus: QuizStatus;
  quizAttempts: number; // 1 or 2

  // Reward step
  completionResult: CompleteLessonResponse | null;
  isLevelUpModalVisible: boolean;

  // Actions
  initLesson: (lesson: LessonDetail) => void;
  setStep: (step: LessonStep) => void;
  decrementCountdown: () => void;
  setCardIndex: (index: number) => void;
  toggleKeyTerm: (term: string) => void;

  // Choice Sim Actions
  selectChoiceOption: (stepIndex: number, optionIndex: number) => void;
  nextScenarioStep: () => void;
  revealHint: (stepIndex: number) => void;
  resetScenarioSim: () => void;

  // Calculator Sim Actions
  setCalculatorInput: (key: string, value: number) => void;
  resetCalculatorSim: (defaults: Record<string, number>) => void;

  // Quiz Actions
  selectQuizOption: (index: number) => void;
  checkQuizAnswer: (correctIndex: number) => void;
  retryQuiz: () => void;

  // Reward Actions
  setCompletionResult: (result: CompleteLessonResponse) => void;
  setLevelUpModalVisible: (visible: boolean) => void;

  // Reset entire machine
  resetMachine: () => void;
}

const initialState = {
  currentStep: 'hook' as LessonStep,
  lesson: null,
  hookCountdown: 3,
  isHookReady: false,
  currentCardIndex: 0,
  revealedKeyTerms: {},
  scenarioStepIndex: 0,
  scenarioSelections: {},
  hintsUsed: 0,
  hintsRevealed: {},
  calculatorInputs: {},
  calculatorHasInteracted: false,
  selectedQuizOption: null,
  quizStatus: 'unanswered' as QuizStatus,
  quizAttempts: 1,
  completionResult: null,
  isLevelUpModalVisible: false,
};

export const useLessonMachine = create<LessonMachineState>((set) => ({
  ...initialState,

  initLesson: (lesson: LessonDetail) => {
    // Populate calculator defaults if simulation is calculator
    const initialCalcInputs: Record<string, number> = {};
    if (lesson.content.simulation.type === 'calculator') {
      lesson.content.simulation.inputs.forEach((input) => {
        initialCalcInputs[input.key] = input.defaultValue;
      });
    }

    set({
      ...initialState,
      lesson,
      calculatorInputs: initialCalcInputs,
    });
  },

  setStep: (step: LessonStep) => set({ currentStep: step }),

  decrementCountdown: () =>
    set((state) => {
      if (state.hookCountdown <= 1) {
        return { hookCountdown: 0, isHookReady: true };
      }
      return { hookCountdown: state.hookCountdown - 1 };
    }),

  setCardIndex: (index: number) => set({ currentCardIndex: index }),

  toggleKeyTerm: (term: string) =>
    set((state) => ({
      revealedKeyTerms: {
        ...state.revealedKeyTerms,
        [term]: !state.revealedKeyTerms[term],
      },
    })),

  selectChoiceOption: (stepIndex: number, optionIndex: number) =>
    set((state) => ({
      scenarioSelections: {
        ...state.scenarioSelections,
        [stepIndex]: optionIndex,
      },
    })),

  nextScenarioStep: () =>
    set((state) => ({
      scenarioStepIndex: state.scenarioStepIndex + 1,
    })),

  revealHint: (stepIndex: number) =>
    set((state) => {
      if (state.hintsRevealed[stepIndex] || state.hintsUsed >= 3) {
        return state;
      }
      return {
        hintsUsed: Math.min(3, state.hintsUsed + 1),
        hintsRevealed: {
          ...state.hintsRevealed,
          [stepIndex]: true,
        },
      };
    }),

  resetScenarioSim: () =>
    set({
      scenarioStepIndex: 0,
      scenarioSelections: {},
      hintsRevealed: {},
      // Keep hintsUsed count so user cannot exploit resets to get free hints
    }),

  setCalculatorInput: (key: string, value: number) =>
    set((state) => ({
      calculatorInputs: {
        ...state.calculatorInputs,
        [key]: value,
      },
      calculatorHasInteracted: true,
    })),

  resetCalculatorSim: (defaults: Record<string, number>) =>
    set({
      calculatorInputs: defaults,
      calculatorHasInteracted: false,
    }),

  selectQuizOption: (index: number) =>
    set((state) => {
      // Once finalized (correct or second_wrong), selections are locked
      if (state.quizStatus === 'correct' || state.quizStatus === 'second_wrong') {
        return state;
      }
      return { selectedQuizOption: index };
    }),

  checkQuizAnswer: (correctIndex: number) =>
    set((state) => {
      if (state.selectedQuizOption === null) return state;

      const isCorrect = state.selectedQuizOption === correctIndex;

      if (isCorrect) {
        return {
          quizStatus: 'correct',
        };
      }

      // First attempt wrong
      if (state.quizAttempts === 1) {
        return {
          quizStatus: 'first_wrong',
        };
      }

      // Second attempt wrong
      return {
        quizStatus: 'second_wrong',
      };
    }),

  retryQuiz: () =>
    set((state) => ({
      selectedQuizOption: null,
      quizStatus: 'unanswered',
      quizAttempts: state.quizAttempts + 1,
    })),

  setCompletionResult: (result: CompleteLessonResponse) =>
    set({
      completionResult: result,
      isLevelUpModalVisible: result.leveledUp,
    }),

  setLevelUpModalVisible: (visible: boolean) =>
    set({ isLevelUpModalVisible: visible }),

  resetMachine: () => set(initialState),
}));
