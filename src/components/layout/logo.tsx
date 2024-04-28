import Link from "next/link";

export default function Logo() {
    return (
        <Link href={'/'} className="font-bold text-3xl bg-gradient-to-r from-indigo-400 to-cyan-300 text-transparent bg-clip-text hover:cursor-pointer">Языковой лифт</Link>
    );
  }
  