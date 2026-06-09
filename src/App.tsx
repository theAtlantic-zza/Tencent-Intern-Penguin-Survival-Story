import { useEffect, useState } from 'react';
import { useGame } from './game/store';
import { ENDINGS, ACHIEVEMENTS } from './game/endings';
import HomeScreen from './screens/HomeScreen';
import NamingScreen from './screens/NamingScreen';
import PlayingScreen from './screens/PlayingScreen';
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
        {stage === 'playing' && (
          <PlayingScreen onOpenCollection={() => setShowCollection(true)} />
        )}
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
