import Link from "next/link";

const NotFound = () => {
  return (
    <div>
      <h1>Page was not found</h1>
      <Link href={"/"}>Back to the main page</Link>
    </div>
  );
};

export default NotFound;
