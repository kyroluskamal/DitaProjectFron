import { environment } from '../environments/environment.development';

export const DocumentsApi = {
  baseUrl: `${environment.apiUrl}/api/Documents`,

  getById(id: number) {
    return `${this.baseUrl}/${id}`;
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

  postDitaTopicVersion(
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

  createDitaTopicVersions(docId: number, docVersionId: number) {
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
  baseUrl: `${environment.apiUrl}/api/DitaTopics`,

  getAll() {
    return this.baseUrl;
  },

  getById(id: number) {
    return `${this.baseUrl}/${id}`;
  },

  update(id: number) {
    return `${this.baseUrl}/${id}`;
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
  usersBaseUrl: `${environment.apiUrl}/api/users`,
  baseUrl: `${environment.apiUrl}/api`,
  rolesBaseUrl: `${environment.apiUrl}/api/roles`,

  login() {
    return `${this.baseUrl}/login`;
  },

  register() {
    return `${this.usersBaseUrl}`;
  },

  getUserById(id: number) {
    return `${this.usersBaseUrl}/${id}`;
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
};
