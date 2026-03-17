import path from "path";
import { readJSON, writeJSON, listJSONFiles, deleteFile, ensureDir, fileExists } from "@/lib/utils/fs";
import type { IRepository } from "../interfaces/base.repository";

export class BaseFileRepository<T extends { id: string }> implements IRepository<T> {
  constructor(protected readonly dirPath: string) {}

  protected getFilePath(id: string): string {
    return path.join(this.dirPath, `${id}.json`);
  }

  async findAll(): Promise<T[]> {
    const files = await listJSONFiles(this.dirPath);
    const items: T[] = [];
    for (const file of files) {
      try {
        const item = await readJSON<T>(file);
        items.push(item);
      } catch {
        // Skip malformed files
      }
    }
    return items;
  }

  async findById(id: string): Promise<T | null> {
    const filePath = this.getFilePath(id);
    try {
      return await readJSON<T>(filePath);
    } catch {
      return null;
    }
  }

  async findBy(predicate: (item: T) => boolean): Promise<T[]> {
    const all = await this.findAll();
    return all.filter(predicate);
  }

  async create(data: T): Promise<T> {
    await ensureDir(this.dirPath);
    const filePath = this.getFilePath(data.id);
    await writeJSON(filePath, data);
    return data;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`Entity not found: ${id}`);
    }
    const updated = { ...existing, ...data, id } as T;
    await writeJSON(this.getFilePath(id), updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await deleteFile(this.getFilePath(id));
  }

  async exists(id: string): Promise<boolean> {
    return fileExists(this.getFilePath(id));
  }
}
