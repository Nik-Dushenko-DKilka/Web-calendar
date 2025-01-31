import Link from "next/link";
import Image from "next/image";

const Login = () => {
  return (
    <div className="flex flex-col justify-center h-screen">
      <Image
        src={"/svg/logo.svg"}
        alt="logo icon"
        className="w-1/2 block self-center h-16"
        width={0}
        height={0}
      ></Image>
      <Link
        href={"/"}
        className="text-center text-4xl hover:text-blue-700 hover:duration-300"
      >
        Login
      </Link>
    </div>
  );
};

export default Login;
