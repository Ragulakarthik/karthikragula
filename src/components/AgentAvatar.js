import Image from "next/image";

export default function AgentAvatar({ className = "h-8 w-8" }) {
  return (
    <Image
      src="/karthik-avatar.jpg"
      alt="Karthik"
      width={96}
      height={96}
      className={`rounded-full object-cover ${className}`}
    />
  );
}
