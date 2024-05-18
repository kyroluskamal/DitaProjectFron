import { FormArray, FormControl, FormGroup } from '@angular/forms';

class CommonModel {
  id: number = 0;
}

export class DocVersion extends CommonModel {
  versionNumber: string = '';
  createdAt: Date = new Date();

  documentId: number = 0;
  document?: Documento;
  ditatopicVersions: DocVersionDitatopicVersion[] = [];
  ditaTopics: DitaTopic[] = [];
  roles: DocVersionsRoles[] = [];
}

export class DocVersionsRoles {
  roleId: number = 0;
  role?: IdentityRole;
  docVersionId: number = 0;
  docVersion?: DocVersion;
  ditaMapXml: string = '';
  ditaMapFilePath: string = '';
  pdFfilePath: string = '';
}
export class IdentityRole {
  id: number = 0;
  name: string = '';
}
export class Documento extends CommonModel {
  title: string = '';
  authorId: number = 0;
  author?: ApplicationUser;
  folderName: string = '';
  docFamilyId: number = 0;
  docFamily?: DocFamily;
  ditaTopics: DitaTopic[] = [];
  docVersions: DocVersion[] = [];
}

export class DitaTopic extends CommonModel {
  title: string = '';
  createdAt: Date = new Date();
  docFamilyId = 0;
  docFamily: DocFamily = new DocFamily();
  ditatopicVersions: DitatopicVersion[] = [];
  isRequired: boolean = false;
  chosen: boolean = false;
}

export abstract class DitatopicVersion extends CommonModel {
  shortDescription?: string = '';
  xmlContent: string = '';
  fileName: string = '';
  createdAt: Date = new Date();
  versionNumber: string = '';
  filePath: string = '';
  ditaTopicId: number = 0;
  ditaTopic?: DitaTopic;
  docVersions: DocVersionDitatopicVersion[] = [];
}

export class Concept extends DitaTopic {}

export class Tasks extends DitaTopic {}

export class Reference extends DitaTopic {}

export class ConceptVersion extends DitatopicVersion {
  body: string = '';
}

export class TaskVersion extends DitatopicVersion {
  steps: Step[] = [];
}

export class ReferenceVersion extends DitatopicVersion {
  body: string = '';
}

export class Step extends CommonModel {
  order: number = 0;
  command: string = '';
  taskVersionId: number = 0;
  taskVersion?: TaskVersion;
}
export class DitaTopicVersionsRoles {
  roleId: number = 0;
  role?: IdentityRole;
  ditatopicVersionId: number = 0;
  ditatopicVersion?: DitatopicVersion;
}
export class DocVersionDitatopicVersion {
  docVersionId: number = 0;
  ditatopicVersionId: number = 0;
  docVersion?: DocVersion;
  ditatopicVersion?: DitatopicVersion;
}

export class DitaTopicModelView extends CommonModel {
  title: string = '';
  docFamilyId: number = 0;
  isRequired: boolean = false;
}

export class DitaTopicUpdateViewModel {
  constructor(title: string | null, documentId: number | null) {}
}

export class DitaTopicVersionViewModel extends CommonModel {
  shortDescription: string = '';
  type: number = 0;
  ditaTopicId: number = 0;
  versionNumber: string = '';
  body: string = '';
  steps: StepViewModel[] = [];
  roles: number[] = [];
}

export class DocVersionViewModel extends CommonModel {
  versionNumber: string = '';
  documentId: number = 0;
}

export class DocVersionUpdateViewModel {
  constructor(versionNumber: string) {}
}

export class DucumentModelView extends CommonModel {
  title?: string = '';
  authorId: number = 0;
  versionNumber?: string = '';
  docFamilyId: number = 0;
}

export class DocumentUpdateViewModel {
  title: string | null = '';
}

export class StepViewModel extends CommonModel {
  order: number = 0;
  command: string = '';
  taskId: number = 0;
}
export class ApplicationUser {
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  roles: string[] = [];
}

export class AppRegisterRequest {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  role: string = '';
}
export class LoginRequest {
  email: string = '';
  password: string = '';
}
export class LoginResponse {
  accessToken: string = '';
  refreshToken: string = '';
}
export class SuccessResponse {
  message: string = '';
  data: any = {};
}
export const roles = {
  Technician: 'Technician',
  Admin: 'Admin',
  Analyst: 'Analyst',
  Developer: 'Developer',
};
export type ModelFormGroup<T> = FormGroup<{
  [K in keyof T]: T[K] extends Array<infer U>
    ? U extends object
      ? FormArray<FormGroup<{ [P in keyof U]: FormControl<U[P]> }>>
      : FormControl<U[]>
    : FormControl<T[K]>;
}>;
export type ModelFormArray<T> = FormArray<ModelFormGroup<T>>;
export enum DitaTopicType {
  Concept = 0,
  Task = 1,
  Reference = 2,
}

export class DocFamilyViewModel extends CommonModel {
  title = '';
  description = '';
  folderName = '';
}
export class DocFamily extends DocFamilyViewModel {
  ditaTopics: DitaTopic[] = [];
  documentos: Documento[] = [];
}
