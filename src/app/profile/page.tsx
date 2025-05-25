"use client";
import { signOut, useSession } from "next-auth/react";

const Profile = () => {
  const session = useSession();

  return (
    <>
      <main className="flex p-4 h-[90%]">
        <aside>
          <img
            src={session?.data?.user?.image!}
            alt=""
            className="justify-self-center w-52"
          />
        </aside>
        <h2 className="ml-4 font-bold text-4xl">{session?.data?.user?.name}</h2>
      </main>
      <footer className="h-[10%]">
        <button
          onClick={() =>
            signOut({
              callbackUrl: "/",
            })
          }
        >
          Log out
        </button>
      </footer>
    </>
  );
};

export default Profile;
