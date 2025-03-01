import pkg from "next-auth/package.json";

export default function DebugPage() {
  return <div>NextAuth Version: {pkg.version}</div>;
}
