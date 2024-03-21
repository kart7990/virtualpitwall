export class DashboardComponent {
  public id: string;
  public content: React.ReactNode;
  public title: string;
  public description: string;

  constructor(
    id: string,
    title: string,
    description: string,
    content: React.ReactNode,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.content = content;
  }
}
