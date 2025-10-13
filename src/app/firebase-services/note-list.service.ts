import { Injectable, inject, OnDestroy } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { collectionData, Firestore, collection, doc, onSnapshot, addDoc, updateDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService implements OnDestroy{

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  // items$;
  // items;
  firestore = inject(Firestore); 
  unsubNotes;
  unsubTrash;


  constructor() {
    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNotesList();
  }

  async addNote(item:Note){
    await addDoc(this.getNotesRef(),item).catch(
      (err) => {  console.error(err)}
    ).then(
      (docRef) => { console.log("Document written with id: ", docRef?.id);}
      );

  }

  getColIdFromNote(note:Note):string{
    if(note.type == "note"){
      return "notes"
    } else {
      return "trash"
    }
    }

  async updateNote(note:Note){
    if(note.id){
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note),note.id);
    await updateDoc(docRef, this.getCleanJSON(note)).catch(
      (err) => { console.error(err)}
    ).then(
      () => { console.log("Document successfully updated!");}
    );
  }
  }

  getCleanJSON(note:Note):{}{
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked:note.marked
  
    }
  }


  ngOnDestroy(){
      this.unsubTrash();
    this.unsubNotes();
  }

  subTrashList(){
return onSnapshot(this.getTrashRef(), (list) =>{
  this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      } );
    });

  }

  subNotesList(){
    return onSnapshot(this.getNotesRef(), (list) =>{
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }


   getNotesRef(){
    return collection(this.firestore, 'notes');
   }
   getTrashRef(){
    return collection(this.firestore, 'trash');
   }
  
   getSingleDocRef(colId: string, docId:string){
    return doc(collection(this.firestore, colId), docId);
   }

   setNoteObject(obj:any, id:string):Note{
    const note: Note = {
      id: id || "",
      type: obj.type || "note" ,
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
    return note;
   }

}
