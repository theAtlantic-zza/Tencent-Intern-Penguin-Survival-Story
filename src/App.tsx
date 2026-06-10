import { useEffect, useState } from 'react';
import { useGame } from './game/store';
import { ENDINGS, ACHIEVEMENTS } from './game/endings';
import HomeScreen from './screens/HomeScreen';
import NamingScreen from './screens/NamingScreen';
import DifficultyScreen from './screens/DifficultyScreen';
import ChoosingScreen from './screens/ChoosingScreen';
import MentorScreen from './screens/MentorScreen';
import TalentScreen from './screens/TalentScreen';
import PlayingScreen from './screens/PlayingScreen';
import MonthlyReportScreen from './screens/MonthlyReportScreen';
import EndedScreen from './screens/EndedScreen';
import CollectionModal from './components/CollectionModal';

export default function App() {
  const stage = useGame((s) => s.stage);
  const [showCollection, setShowCollection] = useState(false);

  useEffect(() => {
    document.documentElement.style.overscrollBehavior = 'none';
  }, []);

  return (
    <div className="min-h-full w-full px-4 py-5 md:py-8">
      <div className="mx-auto w-full max-w-[440px]">
        {stage === 'home' && (
          <HomeScreen onOpenCollection={() => setShowCollection(true)} />
        )}
        {stage === 'naming' && <NamingScreen />}
        {stage === 'difficulty' && <DifficultyScreen />}
        {stage === 'choosing' && <ChoosingScreen />}
        {stage === 'mentor' && <MentorScreen />}
        {stage === 'talent' && <TalentScreen />}
        {stage === 'playing' && (
          <PlayingScreen onOpenCollection={() => setShowCollection(true)} />
        )}
        {stage === 'report' && <MonthlyReportScreen />}
        {stage === 'ended' && (
          <EndedScreen onOpenCollection={() => setShowCollection(true)} />
        )}
      </div>

      {showCollection && (
        <CollectionModal
          endings={ENDINGS}
          achievements={ACHIEVEMENTS}
          onClose={() => setShowCollection(false)}
        />
      )}
    </div>
  );
}
