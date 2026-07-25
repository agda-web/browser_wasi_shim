// import { debug } from "./debug.js";
// import * as wasi from "./wasi_defs.js";
// import { Fd } from "./fd.js";

// import { SPSCReader, SPSCError } from "spsc/reader";
// import { SPSCWriter } from "spsc/writer";

// interface Pollable {
//   pollRead(timeout?: number): boolean;
//   pollWrite(timeout?: number): boolean;
// }

// export class ReadablePipe extends Fd implements Pollable {
//   private ino: bigint;
//   nonblock = false;
//   reader: SPSCReader;

//   constructor(buf: SharedArrayBuffer) {
//     super();
//     this.ino = 0n;
//     this.reader = new SPSCReader(buf);
//   }

//   fd_fdstat_set_flags(flags: number): number {
//     this.nonblock = !!(flags & wasi.FDFLAGS_NONBLOCK);
//     return 0;
//   }

//   fd_filestat_get(): { ret: number; filestat: wasi.Filestat } {
//     const filestat = new wasi.Filestat(
//       this.ino,
//       wasi.FILETYPE_CHARACTER_DEVICE,
//       BigInt(0),
//     );
//     return { ret: 0, filestat };
//   }

//   fd_fdstat_get(): { ret: number; fdstat: wasi.Fdstat | null } {
//     const fdstat = new wasi.Fdstat(wasi.FILETYPE_CHARACTER_DEVICE, 0);
//     fdstat.fs_rights_base = BigInt(wasi.RIGHTS_FD_WRITE);
//     return { ret: 0, fdstat };
//   }

//   fd_read(size: number): { ret: number; data: Uint8Array } {
//     const rr = this.reader.read(size, { nonblock: this.nonblock });
//     if (rr.ok === false) {
//       if (rr.error === SPSCError.Again) {
//         return { ret: wasi.ERRNO_AGAIN, data: new Uint8Array() };
//       } else {
//         throw new Error(`Unhandled SPSC reader error ${rr.error}`);
//       }
//     } else {
//       return { ret: wasi.ERRNO_SUCCESS, data: rr.data };
//     }
//   }

//   pollRead(timeout?: number): boolean {
//     return this.reader.pollRead(timeout);
//   }

//   pollWrite(): never {
//     throw new Error("Attempt to call pollWrite on a readable pipe");
//   }
// }

// export class WritablePipe extends Fd implements Pollable {
//   private ino: bigint;
//   nonblock = false;
//   writer: SPSCWriter;

//   constructor(buf: SharedArrayBuffer) {
//     super();
//     this.ino = 0n;
//     this.writer = new SPSCWriter(buf);
//   }

//   fd_fdstat_set_flags(flags: number): number {
//     this.nonblock = !!(flags & wasi.FDFLAGS_NONBLOCK);
//     return 0;
//   }

//   fd_filestat_get(): { ret: number; filestat: wasi.Filestat } {
//     const filestat = new wasi.Filestat(
//       this.ino,
//       wasi.FILETYPE_CHARACTER_DEVICE,
//       BigInt(0),
//     );
//     return { ret: 0, filestat };
//   }

//   fd_fdstat_get(): { ret: number; fdstat: wasi.Fdstat | null } {
//     const fdstat = new wasi.Fdstat(wasi.FILETYPE_CHARACTER_DEVICE, 0);
//     fdstat.fs_rights_base = BigInt(wasi.RIGHTS_FD_WRITE);
//     return { ret: 0, fdstat };
//   }

//   fd_write(data: Uint8Array): { ret: number; nwritten: number } {
//     const wr = this.writer.write(data, { nonblock: this.nonblock });
//     if (wr.ok === false) {
//       if (wr.error === SPSCError.Again) {
//         return { ret: wasi.ERRNO_AGAIN, nwritten: 0 };
//       } else {
//         throw new Error(`Unhandled SPSC writer error ${wr.error}`);
//       }
//     } else {
//       return { ret: wasi.ERRNO_SUCCESS, nwritten: wr.bytesWritten };
//     }
//   }

//   pollRead(): never {
//     throw new Error("Attempt to call pollRead on a writable pipe");
//   }

//   pollWrite(timeout?: number): boolean {
//     return this.writer.pollWrite(timeout);
//   }
// }
