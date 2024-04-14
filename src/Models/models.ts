class CommonModel {
  public id: number = 0;
}

export class DocVersion extends CommonModel {
  public versionNumber: string = '';
  public createdAt: Date = new Date();
  public ditaMapXml: string = '';
  public pdFfilePath: string = '';
  public ditaMapFilePath: string = '';
  public documentId: number = 0;
  public document?: Documento;
  public ditaTopicVersions: DocVersionDitatopicVersion[] = [];
  public ditaTopics: DitaTopic[] = [];
}

export class Documento extends CommonModel {
  public title: string = '';
  public authorId: number = 0;
  public author?: ApplicationUser;
  public folderName: string = '';
  public ditaTopics: DitaTopic[] = [];
  public docVersions: DocVersion[] = [];
}

export abstract class DitaTopic extends CommonModel {
  public title: string = '';
  public createdAt: Date = new Date();
  public documentId: number = 0;
  public document?: Documento;
  public ditaTopicVersions: DitatopicVersion[] = [];
}

export abstract class DitatopicVersion extends CommonModel {
  public shortDescription?: string = '';
  public xmlContent: string = '';
  public fileName: string = '';
  public createdAt: Date = new Date();
  public versionNumber: string = '';
  public filePath: string = '';
  public ditaTopicId: number = 0;
  public ditaTopic?: DitaTopic;
  public docVersions: DocVersionDitatopicVersion[] = [];
}

export class Concept extends DitaTopic {}

export class Tasks extends DitaTopic {}

export class Reference extends DitaTopic {}

export class ConceptVersion extends DitatopicVersion {
  public body: string = '';
}

export class TaskVersion extends DitatopicVersion {
  public steps: Step[] = [];
}

export class ReferenceVersion extends DitatopicVersion {
  public body: string = '';
}

export class Step extends CommonModel {
  public order: number = 0;
  public command: string = '';
  public taskVersionId: number = 0;
  public taskVersion?: TaskVersion;
}

export class DocVersionDitatopicVersion {
  public docVersionId: number = 0;
  public ditatopicVersionId: number = 0;
  public docVersion?: DocVersion;
  public ditatopicVersion?: DitatopicVersion;
}

export class DitaTopicModelView extends CommonModel {
  public title: string = '';
  public shortDescription: string = '';
  public type: number = 0;
  public documentId: number = 0;
  public versionId: number = 0;
  public versionNumber: string = '';
  public body: string = '';
  public steps: StepViewModel[] = [];
}

export class DitaTopicUpdateViewModel {
  constructor(
    public title: string,
    public documentId: number,
    public type: number
  ) {}
}

export class DitaTopicVersionViewModel extends CommonModel {
  public shortDescription: string = '';
  public type: number = 0;
  public ditaTopicId: number = 0;
  public versionNumber: string = '';
  public body: string = '';
  public steps: StepViewModel[] = [];
}

export class DocVersionViewModel extends CommonModel {
  public versionNumber: string = '';
  public documentId: number = 0;
}

export class DocVersionUpdateViewModel {
  constructor(public versionNumber: string) {}
}

export class DucumentModelView extends CommonModel {
  public title?: string = '';
  public authorId: number = 0;
  public versionNumber?: string = '';
}

export class DocumentUpdateViewModel {
  constructor(public title: string) {}
}

export class StepViewModel extends CommonModel {
  public order: number = 0;
  public command: string = '';
  public taskId: number = 0;
}
export class ApplicationUser {
  public firstName: string = '';
  public lastName: string = '';
  public email: string = '';
  public password: string = '';
}

export class AppRegisterRequest {
  public email: string = '';
  public password: string = '';
  public firstName: string = '';
  public lastName: string = '';
  public role: string = '';
}
