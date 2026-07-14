import type { Photo, TournamentAction, TournamentState } from '../types';

export const initialTournamentState: TournamentState = {
  screen: 'upload',
  uploadedPhotos: [],
  roundPhotos: [],
  roundNumber: 1,
  currentIndex: 0,
  selected: [],
  rejected: [],
};

export function tournamentReducer(
  state: TournamentState,
  action: TournamentAction,
): TournamentState {
  switch (action.type) {
    case 'ADD_PHOTOS': {
      return {
        ...state,
        uploadedPhotos: [...state.uploadedPhotos, ...action.photos],
      };
    }

    case 'REMOVE_PHOTO': {
      return {
        ...state,
        uploadedPhotos: state.uploadedPhotos.filter((photo: Photo): boolean => photo.id !== action.id),
      };
    }

    case 'START_TOURNAMENT': {
      return {
        ...state,
        screen: 'swipe',
        roundPhotos: state.uploadedPhotos,
        roundNumber: 1,
        currentIndex: 0,
        selected: [],
        rejected: [],
      };
    }

    case 'SWIPE': {
      const currentPhoto: Photo | undefined = state.roundPhotos[state.currentIndex];
      if (!currentPhoto) {
        return state;
      }

      const nextSelected: readonly Photo[] =
        action.direction === 'right' ? [...state.selected, currentPhoto] : state.selected;
      const nextRejected: readonly Photo[] =
        action.direction === 'left' ? [...state.rejected, currentPhoto] : state.rejected;
      const nextIndex: number = state.currentIndex + 1;

      const roundFinished: boolean = nextIndex >= state.roundPhotos.length;

      if (!roundFinished) {
        return {
          ...state,
          currentIndex: nextIndex,
          selected: nextSelected,
          rejected: nextRejected,
        };
      }

      if (nextSelected.length === 0) {
        return {
          ...state,
          screen: 'roundFailed',
          currentIndex: nextIndex,
          selected: nextSelected,
          rejected: nextRejected,
        };
      }

      if (nextSelected.length === 1) {
        return {
          ...state,
          screen: 'winner',
          currentIndex: nextIndex,
          selected: nextSelected,
          rejected: nextRejected,
        };
      }

      return {
        ...state,
        screen: 'summary',
        currentIndex: nextIndex,
        selected: nextSelected,
        rejected: nextRejected,
      };
    }

    case 'CONTINUE_TO_NEXT_ROUND': {
      return {
        ...state,
        screen: 'swipe',
        roundPhotos: state.selected,
        roundNumber: state.roundNumber + 1,
        currentIndex: 0,
        selected: [],
        rejected: [],
      };
    }

    case 'RETRY_ROUND': {
      return {
        ...state,
        screen: 'swipe',
        currentIndex: 0,
        selected: [],
        rejected: [],
      };
    }

    case 'RESTART': {
      return initialTournamentState;
    }

    default:
      return state;
  }
}
