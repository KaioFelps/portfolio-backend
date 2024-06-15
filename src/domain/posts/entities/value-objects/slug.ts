export class Slug {
  public value: string;

  private constructor(slug: string) {
    this.value = slug;
  }

  static fromTitle(title: string, id: string) {
    const firstSliceFromId = id.trim().split('-')[0];

    const formattedTitle = title
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      // \s significa whitespace
      // g significa global
      .replace(/[^\w-]+/g, '')
      // \w pega todas as palavras
      // ^ diz o oposto, ou seja, pega tudo que NÃO são palavras
      // isso remove os símbolos
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/, '');

    return new Slug(firstSliceFromId + '-' + formattedTitle);
  }

  static create(slug: string) {
    return new Slug(slug);
  }
}
