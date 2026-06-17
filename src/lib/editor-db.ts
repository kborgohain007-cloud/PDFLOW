// ============================================
// PDF Editor Pro — Dexie IndexedDB Persistence
// ============================================
import Dexie, { type Table } from 'dexie';
import type { EditorProject, EditorProjectFile, EditorProjectSnapshot } from '@/types/editor';

class EditorDatabase extends Dexie {
  projects!: Table<EditorProject>;
  files!: Table<EditorProjectFile>;
  snapshots!: Table<EditorProjectSnapshot>;

  constructor() {
    super('pdfEditorDB');
    this.version(1).stores({
      projects: '++id, name, updatedAt',
      files: '++id, projectId, filename',
      snapshots: '++id, projectId, timestamp',
    });
  }
}

export const editorDB = new EditorDatabase();

// ---- Helper Functions ----

export async function saveProject(
  name: string,
  pdfBlob: Blob,
  filename: string,
  annotationsJson: string,
  pageOrderJson: string,
  pagesJson: string,
  existingProjectId?: number,
): Promise<number> {
  const now = new Date();

  if (existingProjectId) {
    // Update existing project
    await editorDB.projects.update(existingProjectId, {
      name,
      updatedAt: now,
    });

    // Update file (replace)
    await editorDB.files.where('projectId').equals(existingProjectId).delete();
    await editorDB.files.add({
      projectId: existingProjectId,
      pdfBlob,
      filename,
    });

    // Add new snapshot (keep last 10)
    await editorDB.snapshots.add({
      projectId: existingProjectId,
      annotations: annotationsJson,
      pageOrder: pageOrderJson,
      pages: pagesJson,
      timestamp: now,
    });

    // Prune old snapshots
    const snapshots = await editorDB.snapshots
      .where('projectId')
      .equals(existingProjectId)
      .sortBy('timestamp');
    if (snapshots.length > 10) {
      const toDelete = snapshots.slice(0, snapshots.length - 10);
      await editorDB.snapshots.bulkDelete(toDelete.map((s) => s.id!));
    }

    return existingProjectId;
  } else {
    // Create new project
    const projectId = await editorDB.projects.add({
      name,
      createdAt: now,
      updatedAt: now,
      pageCount: JSON.parse(pageOrderJson).length,
    });

    await editorDB.files.add({
      projectId: projectId as number,
      pdfBlob,
      filename,
    });

    await editorDB.snapshots.add({
      projectId: projectId as number,
      annotations: annotationsJson,
      pageOrder: pageOrderJson,
      pages: pagesJson,
      timestamp: now,
    });

    return projectId as number;
  }
}

export async function loadProject(projectId: number) {
  const project = await editorDB.projects.get(projectId);
  if (!project) return null;

  const file = await editorDB.files.where('projectId').equals(projectId).first();
  const snapshot = await editorDB.snapshots
    .where('projectId')
    .equals(projectId)
    .reverse()
    .sortBy('timestamp')
    .then((s) => s[0]);

  return { project, file, snapshot };
}

export async function listProjects() {
  return editorDB.projects.orderBy('updatedAt').reverse().toArray();
}

export async function deleteProject(projectId: number) {
  await editorDB.files.where('projectId').equals(projectId).delete();
  await editorDB.snapshots.where('projectId').equals(projectId).delete();
  await editorDB.projects.delete(projectId);
}
