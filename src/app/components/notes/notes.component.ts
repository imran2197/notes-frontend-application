import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../services/notes.service';
import { NoteItemComponent } from '../note-item/note-item.component';
import { ToasterService } from '../../services/toastr.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, NoteItemComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent {
  isLoading: Boolean = false;
  title: String = '';
  description: String = '';
  search: String = '';

  notesData: any = [];
  filteredNotesData: any = [];

  constructor(
    private noteService: NotesService,
    private toasterService: ToasterService
  ) {}
  ngOnInit() {
    this.getAllNotes();
  }

  getAllNotes() {
    this.isLoading = true;
    this.noteService.getAllNotes().subscribe((res: any) => {
      this.notesData = res.response;
      this.filteredNotesData = JSON.parse(JSON.stringify(this.notesData));
      this.isLoading = false;
    });
  }

  onSearch() {
    this.filteredNotesData = this.notesData.filter((item: any) => {
      return item.title.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  updateNotesDataEmitter() {
    this.getAllNotes();
  }

  isLoadingEmitter(value: any) {
    this.isLoading = value;
  }

  handleSubmit() {
    this.isLoading = true;
    const payload = {
      title: this.title,
      description: this.description,
    };
    this.noteService.createNotes(payload).subscribe((res: any) => {
      if (res.statusCode === 201) {
        this.toasterService.success(res.message);
        this.title = '';
        this.description = '';
        this.getAllNotes();
      } else {
        this.toasterService.error(res.message);
      }
    });
  }
}
