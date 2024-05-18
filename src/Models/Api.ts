import { environment } from '../environments/environment.development';

export const DocFamilyApi = {
  baseUrl: `${environment.apiUrl}/DocFamily`,

  getById(id: number) {
    return `${this.baseUrl}/${id}`;
  },
  getAll() {
    return this.baseUrl;
  },
  create() {
    return this.baseUrl;
  },

  update(id: number) {
    return `${this.baseUrl}/${id}`;
  },

  delete(id: number) {
    return `${this.baseUrl}/${id}`;
  },
};

export const DocumentsApi = {
  baseUrl: `${environment.apiUrl}/Documents`,

  getById(id: number) {
    return `${this.baseUrl}/${id}`;
  },
  getAll() {
    return this.baseUrl;
  },
  create() {
    return this.baseUrl;
  },

  update(id: number) {
    return `${this.baseUrl}/${id}`;
  },

  delete(id: number) {
    return `${this.baseUrl}/${id}`;
  },

  getVersions(docId: number) {
    return `${this.baseUrl}/${docId}/versions`;
  },

  getVersionById(docId: number, versionId: number) {
    return `${this.baseUrl}/${docId}/versions/${versionId}`;
  },

  updateVersion(docId: number, versionId: number) {
    return `${this.baseUrl}/${docId}/versions/${versionId}`;
  },

  deleteVersion(docId: number, versionId: number) {
    return `${this.baseUrl}/${docId}/versions/${versionId}`;
  },

  createVersion(docId: number) {
    return `${this.baseUrl}/${docId}/versions`;
  },

  AttachDitaTopicVersion(
    docId: number,
    docVersionId: number,
    ditaTopicVersionId: number
  ) {
    return `${this.baseUrl}/${docId}/versions/${docVersionId}/ditaTopicVersions/${ditaTopicVersionId}`;
  },

  deleteDitaTopicVersion(
    docId: number,
    docVersionId: number,
    ditaTopicVersionId: number
  ) {
    return `${this.baseUrl}/${docId}/versions/${docVersionId}/ditaTopicVersions/${ditaTopicVersionId}`;
  },

  AttachDitaTopic_Versions(docId: number, docVersionId: number) {
    return `${this.baseUrl}/${docId}/versions/${docVersionId}/ditaTopicVersions`;
  },

  updateDitamap() {
    return `${this.baseUrl}/ditamap`;
  },

  postDitamap(docId: number, docVersionId: number) {
    return `${this.baseUrl}/${docId}/versions/${docVersionId}/ditamap`;
  },
};

export const DitaTopicsApi = {
  baseUrl: `${environment.apiUrl}/DitaTopics`,

  getAll() {
    return this.baseUrl;
  },

  getById(id: number) {
    return `${this.baseUrl}/${id}`;
  },

  update(id: number) {
    return `${this.baseUrl}/${id}`;
  },
  updateMany() {
    return `${this.baseUrl}`;
  },

  delete(id: number) {
    return `${this.baseUrl}/${id}`;
  },

  create() {
    return this.baseUrl;
  },

  getVersion(id: number) {
    return `${this.baseUrl}/version/${id}`;
  },

  updateVersion(id: number) {
    return `${this.baseUrl}/version/${id}`;
  },

  deleteVersion(id: number) {
    return `${this.baseUrl}/version/${id}`;
  },

  createVersion() {
    return `${this.baseUrl}/version`;
  },

  getVersions(id: number) {
    return `${this.baseUrl}/${id}/versions`;
  },
};

export const authApi = {
  usersBaseUrl: `${environment.apiDomain}/users`,
  baseUrl: `${environment.apiDomain}`,
  rolesBaseUrl: `${environment.apiDomain}/roles`,

  login() {
    return `${this.baseUrl}/login`;
  },

  register() {
    return `${this.usersBaseUrl}`;
  },

  getUserById(id: number) {
    return `${this.usersBaseUrl}/${id}`;
  },
  getUserByEmail(email: string) {
    return `${this.usersBaseUrl}/${email}`;
  },
  updateUser(id: number) {
    return `${this.usersBaseUrl}/${id}`;
  },

  deleteUser(id: number) {
    return `${this.usersBaseUrl}/${id}`;
  },

  getRoles() {
    return `${this.rolesBaseUrl}`;
  },

  getRoleById(id: number) {
    return `${this.rolesBaseUrl}/${id}`;
  },
  getRolesOfUserId(id: number) {
    return `${this.rolesBaseUrl}/${id}/`;
  },

  getRoleByEmail(email: string) {
    return `${this.rolesBaseUrl}/${email}`;
  },
};
