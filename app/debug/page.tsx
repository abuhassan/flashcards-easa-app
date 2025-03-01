import pkg from "next-auth/package.json";

export default function DebugPage() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Debug Page</h1>
      <p>NextAuth Version: <strong>{pkg.version}</strong></p>
    </div>
  );
}
