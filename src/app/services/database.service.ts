import {Injectable} from '@angular/core';
import {Message} from '../types/message';
import {AuthService} from './auth.service';
import { ClassicGame } from '../types/classicgame';
import { v4 as uuidv4 } from 'uuid';

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

  async startNewGame(startscore, averageThrowBot): Promise<void> {
    const classicGame: ClassicGame = {
      startScore: Number(startscore),
      averageThrowBot: Number(averageThrowBot),
      playerThrows: [],
      botThrows: [],
      user: this.authService.getUserUID(),
      id: uuidv4(),
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
        orderBy('date'),
        where('user', '==', this.authService.getUserUID())
      ),
      convertResult
    );
  }

  async retrieveMessagesAsSnapshot(channel: string): Promise<Message[]> {
    const results = await getDocs<Message>(
      query<Message>(
        this.getCollectionRef<Message>(channel),
        orderBy('date')
      )
    );

    return results.docs.map(d => ({...d.data(), key: d.id}));
  }

  async retrieveMessageAsSnapshot(channel, id): Promise<Message> {
    const result = await getDoc<Message>(
      this.getDocumentRef<Message>(channel, id)
    );

    return ({...result.data(), key: result.id});
  }

  async retrieveMessagesInRealTime(channel: string, observer: ((messages: Message[]) => void)): Promise<void> {
    const convertResult = x => observer(x.docs.map(d => ({...d.data(), key: d.id})));
    onSnapshot<Message>(
      query<Message>(
        this.getCollectionRef<Message>(channel),
        orderBy('date')
      ),
      convertResult
    );
  }

  private getCollectionRef<T>(collectionName: string): CollectionReference<T> {
    return collection(this.fireStore, collectionName) as CollectionReference<T>;
  }

  private getDocumentRef<T>(collectionName: string, id: string): DocumentReference<T> {
    return doc(this.fireStore, collectionName, id) as DocumentReference<T>;
  }
}
