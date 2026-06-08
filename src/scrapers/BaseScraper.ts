export abstract class BaseScraper<T> {
  protected sourceName: string;

  constructor(sourceName: string) {
    this.sourceName = sourceName;
  }

  abstract scrape(): Promise<T[]>;
  
  getSourceName(): string {
    return this.sourceName;
  }
}
