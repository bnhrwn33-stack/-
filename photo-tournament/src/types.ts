// טיפוסי הליבה של אפליקציית הטורניר

export interface Photo {
  readonly id: string;
  readonly url: string;
  readonly name: string;
}

export type Screen = 'upload' | 'swipe' | 'summary' | 'roundFailed' | 'winner';

export type SwipeDirection = 'left' | 'right';

export interface TournamentState {
  readonly screen: Screen;
  /** כל התמונות שהועלו על ידי המשתמש, לפני תחילת הטורניר */
  readonly uploadedPhotos: readonly Photo[];
  /** התמונות המתמודדות בסיבוב הנוכחי */
  readonly roundPhotos: readonly Photo[];
  /** מספר הסיבוב הנוכחי (מתחיל מ-1) */
  readonly roundNumber: number;
  /** האינדקס של התמונה המוצגת כרגע בתוך הסיבוב */
  readonly currentIndex: number;
  /** תמונות שנבחרו (✓) בסיבוב הנוכחי */
  readonly selected: readonly Photo[];
  /** תמונות שנפסלו (X) בסיבוב הנוכחי */
  readonly rejected: readonly Photo[];
}

export type TournamentAction =
  | { readonly type: 'ADD_PHOTOS'; readonly photos: readonly Photo[] }
  | { readonly type: 'REMOVE_PHOTO'; readonly id: string }
  | { readonly type: 'START_TOURNAMENT' }
  | { readonly type: 'SWIPE'; readonly direction: SwipeDirection }
  | { readonly type: 'CONTINUE_TO_NEXT_ROUND' }
  | { readonly type: 'RETRY_ROUND' }
  | { readonly type: 'RESTART' };
