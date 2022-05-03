import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import { ClassicGame } from '../types/classicgame';

// Every import for firestore must come from the following package.
// All other imports use to older, les performant syntax.
import {
  addDoc, collection, Firestore, CollectionReference,
  doc, DocumentReference, deleteDoc, QuerySnapshot,
  query, getDoc, getDocs, updateDoc, orderBy, where, onSnapshot
} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private authService: AuthService, private fireStore: Firestore) {
  }

  async startNewGame(startscore, difficulty): Promise<void> {
    const classicGame: ClassicGame = {
      startScore: Number(startscore),
      remainingScorePlayer: Number(startscore),
      remainingScoreBot: Number(startscore),
      playerThrows: [],
      botThrows: [],
      finished: false,
      difficulty: Number(difficulty),
      user: this.authService.getUserUID(),
      date: Date.now()
    };

    await addDoc<ClassicGame>(
      this.getCollectionRef<ClassicGame>('classicGame'),
      classicGame
    );
  }

  async retrieveGamesInRealTime(channel: string, observer: ((classicGame: ClassicGame[]) => void)): Promise<void> {
    const convertResult = x => observer(x.docs.map(d => ({...d.data(), key: d.id})));
    onSnapshot<ClassicGame>(
      query<ClassicGame>(
        this.getCollectionRef<ClassicGame>(channel),
        orderBy('date', 'desc'),
        where('user', '==', this.authService.userUid.value),
        where('finished', '==', false)
      ),
      convertResult
    );
  }

  async retrieveGameById(id: string): Promise<ClassicGame> {
    const result = await getDoc<ClassicGame>(
      this.getDocumentRef<ClassicGame>('classicGame', id)
    );
    return ({...result.data(), key: result.id});
  }

  async updateGameById(id: string, game: ClassicGame): Promise<void> {
    delete game.key;
    await updateDoc(this.getDocumentRef('classicGame', id), game);
  }

  private getCollectionRef<T>(collectionName: string): CollectionReference<T> {
    return collection(this.fireStore, collectionName) as CollectionReference<T>;
  }

  private getDocumentRef<T>(collectionName: string, id: string): DocumentReference<T> {
    return doc(this.fireStore, collectionName, id) as DocumentReference<T>;
  }
}
