import { Injectable, inject, OnDestroy } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { collectionData, Firestore, collection, doc, onSnapshot} from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService implements OnDestroy{

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  items$;
  items;
  firestore = inject(Firestore); 
  unsubList;
  unsubSingle;


  constructor() {
    this.unsubList = onSnapshot(this.getNotesRef(), (list) =>{
      list.forEach(element => {
        console.log("list:",element);
      } );
    });

    this.unsubSingle = onSnapshot(this.getSingleDocRef('notes', 'kOD81Vd95nz35m6yL5ck'), (element) => {
console.log("single:",element); 

    });

  

  this.items$ = collectionData(this.getNotesRef());
  this.items = this.items$.subscribe( (list) => {
    list.forEach( element => {
      console.log(element);
    })
  })
  }

  ngOnDestroy(){
      this.unsubSingle();
    this.unsubList();
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

}
