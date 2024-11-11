import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <h1 className="text-4xl ">Shritam Mohanty</h1>
      <Link href={`/quiz`}>Quiz</Link>
    </div>
  );
}
