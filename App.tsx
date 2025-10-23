import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { PeriodicTable } from './components/PeriodicTable';
import { Controls } from './components/Controls';
import { ElementDetailModal } from './components/ElementDetailModal';
import { QuizInterface } from './components/QuizInterface';
import { elements } from './data/elements';
import { labelDefinitions } from './data/labels';
import { elementGroupings } from './data/groups';
import type { ElementData, HighlightSelection } from './types';

type QuizMode = null | 'name_to_symbol' | 'symbol_to_name';

// Helper to get a new random element, ensuring it's not the same as the last one
const getRandomElement = (exclude?: ElementData): ElementData => {
  let newElement;
  do {
    newElement = elements[Math.floor(Math.random() * elements.length)];
  } while (exclude && newElement.atomicNumber === exclude.atomicNumber);
  return newElement;
};

// Maps a category like "Alkali Metal" to a group key like "alkali_metals"
const categoryToGroupKey: { [key: string]: string } = {
  "Nonmetal": "nonmetals",
  "Noble Gas": "noble_gases",
  "Alkali Metal": "alkali_metals",
  "Alkaline Earth Metal": "alkaline_earth_metals",
  "Metalloid": "metalloids",
  "Halogen": "halogens",
  "Post-transition Metal": "metals", // Simplified for broader hint
  "Transition Metal": "transition_metals",
  "Lanthanide": "lanthanides",
  "Actinide": "actinides",
};


const App: React.FC = () => {
  // Core state
  const [visibleLabels, setVisibleLabels] = useState<Set<keyof ElementData>>(
    new Set(['atomicNumber', 'symbol', 'name', 'atomicMass'])
  );
  const [highlightSelection, setHighlightSelection] = useState<HighlightSelection>({
    include: new Set(),
    exclude: new Set(),
  });
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

  // Quiz state
  const [quizMode, setQuizMode] = useState<QuizMode>(null);
  const [currentQuizElement, setCurrentQuizElement] = useState<ElementData | null>(null);
  const [quizOptions, setQuizOptions] = useState<ElementData[]>([]);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [quizMessage, setQuizMessage] = useState<string>('');
  const [hintGroup, setHintGroup] = useState<string | null>(null);
  const [revealElement, setRevealElement] = useState<string | null>(null);

  const startQuiz = useCallback((mode: QuizMode) => {
    setQuizMode(mode);
    setHighlightSelection({ include: new Set(), exclude: new Set() }); // Reset highlights
    if (mode) {
      nextQuestion(mode);
    }
  }, []);
  
  const endQuiz = () => {
    setQuizMode(null);
    setCurrentQuizElement(null);
    setQuizMessage('');
    setHintGroup(null);
    setRevealElement(null);
  };

  const nextQuestion = useCallback((currentMode?: QuizMode) => {
    const mode = currentMode || quizMode;
    const newElement = getRandomElement(currentQuizElement ?? undefined);
    setCurrentQuizElement(newElement);
    setQuizAttempts(0);
    setQuizMessage('');
    setHintGroup(null);
    setRevealElement(null);

    if (mode === 'symbol_to_name') {
      const options = [newElement];
      while (options.length < 4) {
        const randomOption = getRandomElement();
        if (!options.some(opt => opt.atomicNumber === randomOption.atomicNumber)) {
          options.push(randomOption);
        }
      }
      // Shuffle options
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      setQuizOptions(options);
    }
  }, [quizMode, currentQuizElement]);

  // Effect to advance question after revealing answer
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (revealElement) {
      timeoutId = setTimeout(() => {
        nextQuestion();
      }, 2500);
    }
    return () => clearTimeout(timeoutId);
  }, [revealElement, nextQuestion]);


  const handleQuizAnswer = (answer: ElementData) => {
    if (!currentQuizElement || revealElement) return;

    if (answer.atomicNumber === currentQuizElement.atomicNumber) {
      setQuizMessage('Correct! Well done.');
      setTimeout(() => nextQuestion(), 1500);
    } else {
      setQuizAttempts(prev => prev + 1);
      if (quizAttempts === 0) {
        const groupKey = categoryToGroupKey[currentQuizElement.category];
        setHintGroup(groupKey);
        setQuizMessage(`Not quite. Hint: The element is a ${currentQuizElement.category}.`);
      } else {
        setQuizMessage(`The correct answer was ${currentQuizElement.name} (${currentQuizElement.symbol}).`);
        setRevealElement(currentQuizElement.symbol);
        setHintGroup(null);
      }
    }
  };


  const handleLabelToggle = (labelKey: keyof ElementData) => {
    setVisibleLabels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(labelKey)) {
        newSet.delete(labelKey);
      } else {
        newSet.add(labelKey);
      }
      return newSet;
    });
  };
  
  const handleHighlightChange = (groupKey: string, mode: 'include' | 'exclude') => {
    setHighlightSelection(prev => {
      const newSelection = {
        include: new Set(prev.include),
        exclude: new Set(prev.exclude),
      };
      const targetSet = newSelection[mode];
      const oppositeMode = mode === 'include' ? 'exclude' : 'include';
      
      if (targetSet.has(groupKey)) {
        targetSet.delete(groupKey);
      } else {
        targetSet.add(groupKey);
        newSelection[oppositeMode].delete(groupKey);
      }
      return newSelection;
    });
  };


  const highlightedSymbols = useMemo(() => {
    if (revealElement) {
      return new Set([revealElement]);
    }
    if (quizMode && hintGroup && elementGroupings[hintGroup]) {
      return new Set(elementGroupings[hintGroup].elements);
    }

    const { include, exclude } = highlightSelection;

    // Determine the base set of symbols to start with.
    // If 'include' is empty, we start with all elements. Otherwise, start with the included ones.
    const baseSymbols = new Set<string>();
    if (include.size === 0) {
      elements.forEach(el => baseSymbols.add(el.symbol));
    } else {
      for (const groupKey of include) {
        if (elementGroupings[groupKey]) {
          elementGroupings[groupKey].elements.forEach(symbol => baseSymbols.add(symbol));
        }
      }
    }

    // Now, remove any excluded symbols from the base set.
    for (const groupKey of exclude) {
      if (elementGroupings[groupKey]) {
        elementGroupings[groupKey].elements.forEach(symbol => baseSymbols.delete(symbol));
      }
    }

    return baseSymbols;
  }, [highlightSelection, quizMode, hintGroup, revealElement]);

  const onElementClick = quizMode === 'name_to_symbol' ? handleQuizAnswer : setSelectedElement;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">Interactive Periodic Table</h1>
        <p className="text-lg text-gray-400 mt-2">Explore the building blocks of the universe.</p>
      </header>

      <main>
        {quizMode ? (
          <QuizInterface
            mode={quizMode}
            currentElement={currentQuizElement}
            options={quizOptions}
            message={quizMessage}
            onAnswer={handleQuizAnswer}
            onEndQuiz={endQuiz}
          />
        ) : (
          <Controls
            labelDefinitions={labelDefinitions}
            elementGroupings={elementGroupings}
            visibleLabels={visibleLabels}
            onLabelToggle={handleLabelToggle}
            highlightSelection={highlightSelection}
            onHighlightChange={handleHighlightChange}
            onQuizModeChange={startQuiz}
          />
        )}
        <div className="mt-8 overflow-x-auto">
          <PeriodicTable
            elements={elements}
            visibleLabels={visibleLabels}
            highlightedSymbols={highlightedSymbols}
            onElementClick={onElementClick}
            isQuizActive={!!quizMode}
            highlightSelection={highlightSelection}
          />
        </div>
      </main>
      
      {selectedElement && !quizMode && (
        <ElementDetailModal
          element={selectedElement}
          onClose={() => setSelectedElement(null)}
        />
      )}
      
      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>Built with React, TypeScript, and Tailwind CSS. Data for educational purposes.</p>
      </footer>
    </div>
  );
};

export default App;
