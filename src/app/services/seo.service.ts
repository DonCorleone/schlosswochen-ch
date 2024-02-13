import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private meta: Meta, private title: Title) {}

  setTitle(newTitle: string, postfix: string) {
    const postfixStripped = postfix == '/' ? 'Home' : postfix.replace('/', '');
    this.title.setTitle(`${newTitle} - ${this.titleCaseWord(postfixStripped)}`);
  }

  setDescription(newDescription: string, prefix: string) {
    const prefixStripped = prefix == '/' ? 'Home' : prefix.replace('/', '');
    this.meta.updateTag({
      name: 'description',
      content: `${this.titleCaseWord(prefixStripped)} : ${newDescription}`,
    });
  }

  titleCaseWord(word: string): string {
    if (!word) return word;
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  }
}
