import { useReducer, useRef } from 'react';
import type { JSX } from 'react';
import { UploadScreen } from './components/UploadScreen';
import { SwipeScreen } from './components/SwipeScreen';
import { RoundSummaryScreen } from './components/RoundSummaryScreen';
import { RoundFailedScreen } from './components/RoundFailedScreen';
import { WinnerScreen } from './components/WinnerScreen';
import { initialTournamentState, tournamentReducer } from './state/tournamentReducer';
import type { Photo, SwipeDirection } from './types';

function createPhotoFromFile(file: File): Photo {
  return {
    id: crypto.randomUUID(),
    url: URL.createObjectURL(file),
    name: file.name,
  };
}

function App(): JSX.Element {
  const [state, dispatch] = useReducer(tournamentReducer, initialTournamentState);
  const createdUrls = useRef<Set<string>>(new Set());

  const handleAddFiles = (files: readonly File[]): void => {
    const photos: Photo[] = files.map((file: File): Photo => {
      const photo: Photo = createPhotoFromFile(file);
      createdUrls.current.add(photo.url);
      return photo;
    });
    dispatch({ type: 'ADD_PHOTOS', photos });
  };

  const handleRemovePhoto = (id: string): void => {
    const photo: Photo | undefined = state.uploadedPhotos.find((item: Photo): boolean => item.id === id);
    if (photo) {
      URL.revokeObjectURL(photo.url);
      createdUrls.current.delete(photo.url);
    }
    dispatch({ type: 'REMOVE_PHOTO', id });
  };

  const handleStart = (): void => dispatch({ type: 'START_TOURNAMENT' });

  const handleSwipe = (direction: SwipeDirection): void => dispatch({ type: 'SWIPE', direction });

  const handleContinueToNextRound = (): void => dispatch({ type: 'CONTINUE_TO_NEXT_ROUND' });

  const handleRetryRound = (): void => dispatch({ type: 'RETRY_ROUND' });

  const handleRestart = (): void => {
    createdUrls.current.forEach((url: string): void => URL.revokeObjectURL(url));
    createdUrls.current.clear();
    dispatch({ type: 'RESTART' });
  };

  switch (state.screen) {
    case 'upload':
      return (
        <UploadScreen
          photos={state.uploadedPhotos}
          onAddFiles={handleAddFiles}
          onRemovePhoto={handleRemovePhoto}
          onStart={handleStart}
        />
      );

    case 'swipe':
      return (
        <SwipeScreen
          roundPhotos={state.roundPhotos}
          currentIndex={state.currentIndex}
          roundNumber={state.roundNumber}
          onSwipe={handleSwipe}
        />
      );

    case 'summary':
      return (
        <RoundSummaryScreen
          roundNumber={state.roundNumber}
          selected={state.selected}
          rejected={state.rejected}
          onContinue={handleContinueToNextRound}
        />
      );

    case 'roundFailed':
      return <RoundFailedScreen onRetry={handleRetryRound} />;

    case 'winner': {
      const winner: Photo | undefined = state.selected[0];
      if (!winner) {
        return <RoundFailedScreen onRetry={handleRetryRound} />;
      }
      return <WinnerScreen winner={winner} onRestart={handleRestart} />;
    }

    default:
      return <UploadScreen photos={[]} onAddFiles={handleAddFiles} onRemovePhoto={handleRemovePhoto} onStart={handleStart} />;
  }
}

export default App;
