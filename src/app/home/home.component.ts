import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";

interface Project {
  description: string;
  director: string;
  name: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './index.html',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  styleUrls: ['./styles.css']
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  currentPage: number = 1;
  pageSize: number = 4; // количество элементов на странице

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http.get<any>('http://localhost:3000/data.json')
      .subscribe(data => {
        this.projects = data.projects; // Получаем массив проектов из объекта projects
        this.filterProjects(); // Вызываем фильтрацию и пагинацию после получения данных
      }, error => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }

  filterProjects(): void {
    this.filteredProjects = this.projects.filter(project =>
      project.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.currentPage = 1; // При фильтрации всегда переходим на первую страницу
    this.paginateProjects(); // Вызываем пагинацию
  }

  paginateProjects(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredProjects = this.filteredProjects.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.paginateProjects();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateProjects();
    }
  }

  totalPages(): number {
    return Math.ceil(this.filteredProjects.length / this.pageSize);
  }

  toggleFavorite(project: Project) {

  }


  createProject() {

  }
}
