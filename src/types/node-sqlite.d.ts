// Deklarasi tipe untuk modul bawaan `node:sqlite`.
//
// Kenapa berkas ini ada: `@types/node` proyek ini masih 20.x, sedangkan
// `node:sqlite` baru muncul di Node 22.5. Akibatnya `tsc` gagal dengan
//   TS2307: Cannot find module 'node:sqlite'
// padahal modulnya ADA di runtime (Node 22.5+/24/26 — sudah diuji).
// Jadi ini murni kekurangan tipe, bukan kode yang salah.
//
// Hapus berkas ini begitu `@types/node` dinaikkan ke >=22.5, karena
// deklarasi bawaan akan menggantikannya.

declare module "node:sqlite" {
  export interface HasilJalankan {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  }

  export interface StatementSync {
    all(...params: unknown[]): unknown[];
    get(...params: unknown[]): unknown;
    run(...params: unknown[]): HasilJalankan;
    iterate(...params: unknown[]): IterableIterator<unknown>;
    columns(): { column: string | null; name: string }[];
    setAllowBareNamedParameters(aktif: boolean): void;
  }

  export interface OpsiDatabase {
    open?: boolean;
    readOnly?: boolean;
    enableForeignKeyConstraints?: boolean;
    enableDoubleQuotedStringLiterals?: boolean;
    allowExtension?: boolean;
    timeout?: number;
  }

  export class DatabaseSync {
    constructor(lokasi: string, opsi?: OpsiDatabase);
    readonly isOpen: boolean;
    open(): void;
    close(): void;
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
  }

  export const constants: Record<string, number>;

  export function backup(...args: unknown[]): unknown;
}
