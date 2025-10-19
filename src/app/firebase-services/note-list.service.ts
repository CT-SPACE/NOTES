import { Injectable, inject, OnDestroy } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import {
  // collectionData,
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  limit,
  orderBy,
  where
} from '@angular/fire/firestore';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteListService implements OnDestroy {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  normalMarkedNotes: Note[] = [];
  firestore = inject(Firestore);
  unsubNotes;
  unsubTrash;
  unsubMarkedNotes;

  constructor() {
    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNotesList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
  }


  async addNote(item: Note, colId: 'notes' | 'trash', docId?: string) {
    if (!docId) {
      await this.addDocCatchLog(this.getNotesRef(), item);
      return;
    }

    if (colId == 'trash') {
      await this.addDocCatchLog(this.getTrashRef(), this.getCleanJSON(item));
    } else if (colId == 'notes') {
      await this.addDocCatchLog(this.getNotesRef(), this.getCleanJSON(item));
    }
  }

  private async addDocCatchLog(collectionRef: any, item: any) {
    await addDoc(collectionRef, item)
      .catch((err) => {
        console.error('Error adding document:', err);
      })
      .then((docRef) => {
        console.log('Document written with id: ', docRef?.id);
      });
  }

  async deleteNote(colId: 'notes' | 'trash', docId: string) {
    if (!docId) return;
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch((err) => {
      console.log(err);
    });
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJSON(note))
        .catch((err) => {
          console.error(err);
        })
        .then(() => {
          console.log('Document successfully updated!');
        });
    }
  }

  getColIdFromNote(note: Note): string {
    if (note.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  getCleanJSON(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    };
  }

  ngOnDestroy() {
    this.unsubTrash();
    this.unsubNotes();
      this.unsubMarkedNotes();
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subNotesList() {
    let ref = collection(this.firestore, "notes/VNeNDoysVGHQFCd76hhy/notesExtra");
    const q = query(ref, orderBy("title"), limit(19));
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
      list.docChanges().forEach((change) => {
        if(change.type === "added"){
          console.log("New note added: ", change.doc.data());
        }
                if(change.type === "modified"){
          console.log("Note modified: ",change.doc.data());
        }
                if(change.type === "removed"){
          console.log("Note removed: ", change.doc.data());
        }
      })
          this.normalNotes.sort((a, b) => 
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
    });
  }

  subMarkedNotesList(){
        const q = query(this.getNotesRef(), where("marked", "==", true));
    return onSnapshot(q, (list) => {
      this.normalMarkedNotes = [];
      list.forEach((element) => {
        this.normalMarkedNotes.push(this.setNoteObject(element.data(), element.id));
      });
          this.normalMarkedNotes.sort((a, b) => 
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
        console.log('Marked notes loaded:', this.normalMarkedNotes); // 
    });
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }
  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  setNoteObject(obj: any, id: string): Note {
    const note: Note = {
      id: id || '',
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false,
    };
    return note;
  }
}
