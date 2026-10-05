import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Kontainer ini dibatasi 2 GiB (cgroup memory.max), tapi os.freemem()
    // melaporkan memori host (71 GB) sehingga Next.js tidak sadar terkekang
    // dan menyalakan 4 worker untuk static generation. Compile lolos, lalu
    // tahap "Collecting page data" mati dengan SIGKILL (exit 137).
    // Satu worker: cukup untuk 59 rute, puncak memori turun drastis.
    cpus: 1,
  },
};

export default nextConfig;
