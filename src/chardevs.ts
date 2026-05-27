// import { debug } from "./debug.js";
import * as wasi from "./wasi_defs.js";
import { Fd } from "./fd.js";
import { SPSCError, SPSCReader } from "spsc/reader";

export class StdinBuffer extends Fd {
  private ino: bigint;
  nonblock = false;
  reader: SPSCReader;

  constructor(buf: SharedArrayBuffer) {
    super();
    this.ino = 0n;
    this.reader = new SPSCReader(buf);
  }

  fd_fdstat_set_flags(flags: number): number {
    this.nonblock = !!(flags & wasi.FDFLAGS_NONBLOCK);
    return 0;
  }

  fd_filestat_get(): { ret: number; filestat: wasi.Filestat } {
    const filestat = new wasi.Filestat(
      this.ino,
      wasi.FILETYPE_CHARACTER_DEVICE,
      BigInt(0),
    );
    return { ret: 0, filestat };
  }

  fd_fdstat_get(): { ret: number; fdstat: wasi.Fdstat | null } {
    const fdstat = new wasi.Fdstat(wasi.FILETYPE_CHARACTER_DEVICE, 0);
    fdstat.fs_rights_base = BigInt(wasi.RIGHTS_FD_WRITE);
    return { ret: 0, fdstat };
  }

  fd_read(size: number): { ret: number; data: Uint8Array } {
    const rr = this.reader.read(size, { nonblock: this.nonblock });
    if (rr.ok === false) {
      if (rr.error === SPSCError.Again) {
        return { ret: wasi.ERRNO_AGAIN, data: new Uint8Array() };
      } else {
        throw new Error(`Unhandled SPSC reader error ${rr.error}`);
      }
    } else {
      return { ret: wasi.ERRNO_SUCCESS, data: rr.data };
    }
  }

  blockUntilAvailable(timeout?: number) {
    this.reader.pollRead(timeout);
  }
}
